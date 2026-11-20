const API_BASE =
  import.meta.env.PUBLIC_ELDEN_RING_API_BASE || 'https://eldenring.fanapis.com/api';

export type EldenRingCategory =
  | 'ammos'
  | 'armors'
  | 'ashes'
  | 'bosses'
  | 'classes'
  | 'creatures'
  | 'incantations'
  | 'items'
  | 'locations'
  | 'npcs'
  | 'shields'
  | 'sorceries'
  | 'spirits'
  | 'talismans'
  | 'weapons';

export interface EldenRingEntity {
  id: string;
  name: string;
  image?: string;
  description?: string;
  [key: string]: unknown;
}

export interface EldenRingListResponse<T = EldenRingEntity> {
  success: boolean;
  count: number;
  total?: number;
  data: T[];
}

export interface FetchListParams {
  limit?: number;
  page?: number;
  name?: string;
}

/**
 * Fetches a paginated or filtered list from the free, no-auth Elden Ring API.
 */
export async function fetchEldenRingList<T = EldenRingEntity>(
  category: EldenRingCategory,
  params: FetchListParams = {}
): Promise<EldenRingListResponse<T>> {
  const url = new URL(`${API_BASE}/${category}`);
  if (params.limit !== undefined) url.searchParams.set('limit', String(params.limit));
  if (params.page !== undefined) url.searchParams.set('page', String(params.page));
  if (params.name) url.searchParams.set('name', params.name);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Elden Ring API error (${response.status}): ${url.toString()}`);
  }
  return response.json() as Promise<EldenRingListResponse<T>>;
}
