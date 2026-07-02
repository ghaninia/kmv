export function formatOrderDateTime(iso: string): { date: string; time: string } {
    const value = new Date(iso);

    return {
        date: value.toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        time: value.toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit',
        }),
    };
}

export function getOrderDateGroupLabel(iso: string): string {
    const value = new Date(iso);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orderDay = new Date(value);
    orderDay.setHours(0, 0, 0, 0);

    const diffDays = Math.round((today.getTime() - orderDay.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'امروز';
    if (diffDays === 1) return 'دیروز';
    if (diffDays < 7) return 'این هفته';

    return value.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
    });
}

export function groupOrdersByDate<T extends { createdAt?: string }>(
    orders: T[],
): Array<{ label: string; orders: T[] }> {
    const groups = new Map<string, T[]>();

    for (const order of orders) {
        const label = order.createdAt ? getOrderDateGroupLabel(order.createdAt) : 'بدون تاریخ';
        const bucket = groups.get(label) ?? [];
        bucket.push(order);
        groups.set(label, bucket);
    }

    return Array.from(groups.entries()).map(([label, bucket]) => ({
        label,
        orders: bucket,
    }));
}
