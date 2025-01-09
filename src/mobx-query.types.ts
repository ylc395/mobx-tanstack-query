import {
  DefaultedQueryObserverOptions,
  DefaultError,
  InvalidateQueryFilters,
  QueryClient,
  QueryFilters,
  QueryKey,
  QueryObserverOptions,
} from '@tanstack/query-core';
import { IDisposer } from 'disposer-util';

import type { MobxQuery } from './mobx-query';
import { MobxQueryClient } from './mobx-query-client';

export interface MobxQueryInvalidateParams
  extends Partial<Omit<InvalidateQueryFilters, 'queryKey' | 'exact'>> {}

export interface MobxQueryResetParams
  extends Partial<Omit<QueryFilters, 'queryKey' | 'exact'>> {}

export interface MobxQueryDynamicOptions<
  TData,
  TError = DefaultError,
  TQueryKey extends QueryKey = QueryKey,
> extends Partial<
    Omit<
      QueryObserverOptions<TData, TError, TData, TData, TQueryKey>,
      'queryFn' | 'enabled' | 'queryKeyHashFn'
    >
  > {
  enabled?: boolean;
}

export interface MobxQueryOptions<
  TData,
  TError = DefaultError,
  TQueryKey extends QueryKey = QueryKey,
> extends DefaultedQueryObserverOptions<
    TData,
    TError,
    TData,
    TData,
    TQueryKey
  > {}

export type MobxQueryUpdateOptions<
  TData,
  TError = DefaultError,
  TQueryKey extends QueryKey = QueryKey,
> = Partial<QueryObserverOptions<TData, TError, TData, TData, TQueryKey>>;

export interface MobxQueryFeatures {
  /**
   * Reset query when dispose is called
   */
  resetOnDispose?: boolean;

  /**
   * Enable query only if result is requested
   */
  enableOnDemand?: boolean;
}

export interface MobxQueryConfig<
  TData,
  TError = DefaultError,
  TQueryKey extends QueryKey = QueryKey,
> extends Partial<
      Omit<
        QueryObserverOptions<TData, TError, TData, TData, TQueryKey>,
        'queryKey'
      >
    >,
    MobxQueryFeatures {
  queryClient: QueryClient | MobxQueryClient;
  /**
   * TanStack Query manages query caching for you based on query keys.
   * Query keys have to be an Array at the top level, and can be as simple as an Array with a single string, or as complex as an array of many strings and nested objects.
   * As long as the query key is serializable, and unique to the query's data, you can use it!
   *
   * **Important:** If you define it as a function then it will be reactively updates query origin key every time
   * when observable values inside the function changes
   *
   * @link https://tanstack.com/query/v4/docs/framework/react/guides/query-keys#simple-query-keys
   */
  queryKey?: TQueryKey | (() => TQueryKey);
  onInit?: (query: MobxQuery<TData, TError, TQueryKey>) => void;
  /**
   * @deprecated use `abortSignal` instead
   */
  disposer?: IDisposer;
  abortSignal?: AbortSignal;
  onDone?: (data: TData, payload: void) => void;
  onError?: (error: TError, payload: void) => void;
  /**
   * Dynamic query parameters, when result of this function changed query will be updated
   * (reaction -> setOptions)
   */
  options?: (
    query: NoInfer<
      MobxQuery<NoInfer<TData>, NoInfer<TError>, NoInfer<TQueryKey>>
    >,
  ) => MobxQueryDynamicOptions<TData, TError, TQueryKey>;
}
