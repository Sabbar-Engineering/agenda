import createDebugger from "debug";
import { createJob } from "../utils";
import { Agenda } from ".";
import { Job } from "../job";
import { ReturnDocument } from "mongodb";

const debug = createDebugger("agenda:internal:_findAndLockNextJob");

/**
 * Find and lock jobs
 * @name Agenda#findAndLockNextJob
 * @function
 * @param jobName name of job to try to lock
 * @param definition definition used to tell how job is run
 * @access protected
 * @caller jobQueueFilling() only
 */
export const findAndLockNextJob = async function (
  this: Agenda,
  jobName: string,
  definition: any
): Promise<Job | undefined> {
  const now = new Date();
  const lockDeadline = new Date(Date.now().valueOf() - definition.lockLifetime);
  debug("_findAndLockNextJob(%s, [Function])", jobName);

  const JOB_PROCESS_WHERE_QUERY = {
    $and: [
      {
        name: jobName,
        disabled: { $ne: true },
      },
      {
        $or: [
          {
            lockedAt: { $eq: null },
            nextRunAt: { $lte: this._nextScanAt },
          },
          {
            lockedAt: { $lte: lockDeadline },
          },
        ],
      },
    ],
  };

  /**
   * Query used to set a job as locked
   * @type {{$set: {lockedAt: Date}}}
   */
  const JOB_PROCESS_SET_QUERY = { $set: { lockedAt: now } };

  /**
   * Query used to affect what gets returned
   * @type {{returnOriginal: boolean, sort: object}}
   */
  const JOB_RETURN_QUERY = { returnDocument: ReturnDocument.AFTER, sort: this._sort };

  // Find ONE and ONLY ONE job and set the 'lockedAt' time so that job begins to be processed
  const result = await this._collection.findOneAndUpdate(
    JOB_PROCESS_WHERE_QUERY,
    JOB_PROCESS_SET_QUERY,
    JOB_RETURN_QUERY
  );

  let job: Job | undefined = undefined;
  if (result.value) {
    debug(
      "found a job available to lock, creating a new job on Agenda with id [%s]",
      result.value._id
    );

    // @ts-ignore
    job = createJob(this, result.value);

    if (
      result.value.lastRunAt &&
      new Date(result.value.lastRunAt.getTime() + definition.lockLifetime) <= new Date()
    ) {
      if (
        (!result.value.failedAt || (result.value.failedAt && result.value.failedAt < result.value.lastRunAt)) &&
        (!result.value.repeatInterval || (result.value.repeatInterval && new Date() <= result.value.nextRunAt)) &&
        (!result.value.repeatInterval || (result.value.repeatInterval && result.value.lastFinishedAt <= result.value.failedAt))
      ) {
        const error = new Error("Timeout")
        job.fail(error)
        this.emit("fail", error, job);
        this.emit("fail:" + jobName, error, job);
        await this.saveJob(job)
      }

      return undefined

    }

  }

  return job;
};
