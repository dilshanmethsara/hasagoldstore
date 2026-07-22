/**
 * Shop2topup API service
 * Handles player ID validation via POST /api/endpoints/v1/player/validate
 */

const API_BASE = 'https://www.shop2topup.com/api/endpoints/v1';

export interface PlayerValidationResult {
  player_id: string;
  player_name: string;
  region?: string;
  [key: string]: string | undefined;
}

export interface ValidatePlayerOptions {
  sub_category_id: number;
  player_id: string;
  /** Optional extra fields required by some games (e.g. server_id for MLBB) */
  requirements?: Record<string, string>;
}

export class Shop2topupService {
  private readonly apiKey: string;

  constructor() {
    const key = process.env.SHOP2TOPUP_API_KEY;
    if (!key) throw new Error('SHOP2TOPUP_API_KEY is not configured');
    this.apiKey = key;
  }

  async validatePlayer(opts: ValidatePlayerOptions): Promise<PlayerValidationResult> {
    const body: Record<string, unknown> = {
      sub_category_id: opts.sub_category_id,
      player_id: String(opts.player_id),
      ...opts.requirements,
    };

    const res = await fetch(`${API_BASE}/player/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });

    const json = await res.json().catch(() => null) as Record<string, any> | null;

    if (!res.ok || !json?.success) {
      const err = json?.error;
      const msg =
        (typeof err === 'string' ? err : err?.message) ??
        (typeof json?.message === 'string' ? json.message : null) ??
        `Player not found`;
      throw new Error(msg);
    }

    // API returns { success, data: { player_id, player_name } }
    return (json.data ?? json.player) as PlayerValidationResult;
  }
}

export const shop2topupService = new Shop2topupService();
