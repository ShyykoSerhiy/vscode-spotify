export const CANCELED_REASON = 'canceled' as 'canceled';
export const NOT_RUNNING_REASON = 'not_running' as 'not_running';

export function createCancelablePromise<T>(
    executor: (resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void) => void
) {
    let cancel: () => void = null as any;
    const promise = new Promise<T>((resolve, reject) => {
        cancel = () => {
            reject(CANCELED_REASON);
        };
        executor(resolve, reject);
    });
    return { promise, cancel };
}
