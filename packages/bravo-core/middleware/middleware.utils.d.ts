import { IObject } from '../shared';
export declare function setCurrentUserId(userId: string): void;
export declare function getCurrentUser<IData = IObject>(field?: string): IData | null;
export declare function getCurrentUserId(): number | null;
