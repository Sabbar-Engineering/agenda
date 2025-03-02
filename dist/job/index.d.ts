import { toJson } from "./to-json";
import { computeNextRunAt } from "./compute-next-run-at";
import { repeatEvery } from "./repeat-every";
import { repeatAt } from "./repeat-at";
import { disable } from "./disable";
import { enable } from "./enable";
import { unique } from "./unique";
import { schedule } from "./schedule";
import { priority } from "./priority";
import { fail } from "./fail";
import { run } from "./run";
import { isRunning } from "./is-running";
import { save } from "./save";
import { remove } from "./remove";
import { touch } from "./touch";
import { setShouldSaveResult } from "./set-shouldsaveresult";
import { Agenda } from "../agenda";
import * as mongodb from "mongodb";
declare type Modify<T, R> = Omit<T, keyof R> & R;
export interface JobAttributesData {
    [key: string]: any;
}
export interface JobAttributes<T extends JobAttributesData = JobAttributesData> {
    /**
     * The record identity.
     */
    _id: mongodb.ObjectId;
    agenda: Agenda;
    /**
     * The type of the job (single|normal).
     */
    type: string;
    /**
     * The name of the job.
     */
    name: string;
    /**
     * Job's state
     */
    disabled?: boolean;
    /**
     * Date/time the job will run next.
     */
    nextRunAt?: Date | null;
    /**
     * Date/time the job was locked.
     */
    lockedAt?: Date | null;
    /**
     * The priority of the job.
     */
    priority: number | string;
    /**
     * The job details.
     */
    data: T;
    unique?: any;
    uniqueOpts?: {
        insertOnly: boolean;
    };
    /**
     * How often the job is repeated using a human-readable or cron format.
     */
    repeatInterval?: string;
    /**
     * The timezone that conforms to [moment-timezone](http://momentjs.com/timezone/).
     */
    repeatTimezone?: string | null;
    repeatAt?: string;
    /**
     * Date/time the job was last run.
     */
    lastRunAt?: Date;
    /**
     * Date/time the job last finished running.
     */
    lastFinishedAt?: Date;
    startDate?: Date | number | null;
    endDate?: Date | number | null;
    skipDays?: string | null;
    /**
     * The reason the job failed.
     */
    failReason?: string;
    /**
     * The number of times the job has failed.
     */
    failCount?: number;
    /**
     * The date/time the job last failed.
     */
    failedAt?: Date;
    /**
     * Date/time the job was last modified.
     */
    lastModifiedBy?: string;
    /**
     * Should the return value of the job be persisted.
     */
    shouldSaveResult?: boolean;
    /**
     * Result of the finished job.
     */
    result?: unknown;
}
/**
 * @class
 * @param {Object} args - Job Options
 * @property {Object} agenda - The Agenda instance
 * @property {Object} attrs
 */
declare class Job<T extends JobAttributesData = JobAttributesData> {
    /**
     * The agenda that created the job.
     */
    agenda: Agenda;
    /**
     * The database record associated with the job.
     */
    attrs: JobAttributes<T>;
    toJSON: typeof toJson;
    computeNextRunAt: typeof computeNextRunAt;
    repeatEvery: typeof repeatEvery;
    repeatAt: typeof repeatAt;
    disable: typeof disable;
    enable: typeof enable;
    unique: typeof unique;
    schedule: typeof schedule;
    priority: typeof priority;
    fail: typeof fail;
    run: typeof run;
    isRunning: typeof isRunning;
    save: typeof save;
    remove: typeof remove;
    touch: typeof touch;
    setShouldSaveResult: typeof setShouldSaveResult;
    constructor(options: Modify<JobAttributes<T>, {
        _id?: mongodb.ObjectId;
    }>);
}
export { Job };
//# sourceMappingURL=index.d.ts.map