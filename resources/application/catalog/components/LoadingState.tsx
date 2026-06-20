/**
 * Skeleton placeholder shown while the catalog is loading.
 *
 * Mirrors the eventual header + sidebar + grid layout so the transition to real
 * content is visually stable (no layout shift). Marked as an `aria-busy` status
 * region so assistive tech announces the loading state.
 */
export function LoadingState() {
    return (
        <div className="min-h-dvh bg-slate-100" role="status" aria-busy="true">
            <span className="sr-only">در حال بارگذاری کاتالوگ…</span>

            {/* Header skeleton. */}
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-8 px-4 py-5 sm:px-6">
                    <div className="flex items-center gap-4">
                        <div className="size-12 animate-pulse rounded-xl bg-slate-200" />
                        <div className="space-y-2">
                            <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
                            <div className="h-3 w-64 animate-pulse rounded bg-slate-100" />
                        </div>
                    </div>
                    <div className="hidden h-11 w-80 animate-pulse rounded-xl bg-slate-200 lg:block" />
                </div>
            </div>

            {/* Body skeleton. */}
            <div className="mx-auto grid max-w-screen-2xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                <div className="hidden h-72 animate-pulse rounded-2xl bg-white lg:block" />
                <div className="space-y-5">
                    <div className="h-7 w-40 animate-pulse rounded bg-slate-200" />
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                            >
                                <div className="aspect-[4/3] animate-pulse bg-slate-200" />
                                <div className="space-y-3 p-5">
                                    <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                                    <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                                    <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                                    <div className="h-9 w-full animate-pulse rounded-xl bg-slate-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
