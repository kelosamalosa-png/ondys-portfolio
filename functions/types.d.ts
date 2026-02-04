/// <reference types="@cloudflare/workers-types" />

interface EventContext<Env, Params extends string = string, Data = unknown> {
  request: Request;
  env: Env;
  params: Record<Params, string>;
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
  next(input?: Request | string, init?: RequestInit): Promise<Response>;
  data: Data;
}

type PagesFunction<Env = unknown, Params extends string = string, Data = unknown> = (
  context: EventContext<Env, Params, Data>
) => Response | Promise<Response>;
