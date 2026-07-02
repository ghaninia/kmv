export function OrderListSkeleton() {
    return (
        <div className="space-y-4" role="status" aria-busy="true" aria-label="در حال بارگذاری سفارش‌ها">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm"
                    >
                        <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
                        <div className="mt-2 h-6 w-10 animate-pulse rounded bg-slate-200" />
                    </div>
                ))}
            </div>

            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm"
                >
                    <div className="flex items-center justify-between gap-3 border-b border-brand-50 px-4 py-4">
                        <div className="flex items-center gap-3">
                            <div className="size-11 animate-pulse rounded-2xl bg-slate-200" />
                            <div className="space-y-2">
                                <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                                <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                            </div>
                        </div>
                        <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
                    </div>
                    <div className="space-y-3 px-4 py-4">
                        <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                    </div>
                    <div className="bg-[#f8fcf9] px-4 py-4">
                        <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}
