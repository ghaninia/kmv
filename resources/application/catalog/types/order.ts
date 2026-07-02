export type CatalogOrderItem = {
    id: string;
    productId: string | null;
    productName: string;
    quantity: number;
    unitPriceToman: number;
    lineTotalToman: number;
};

export type CatalogOrder = {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone?: string;
    customerNote?: string;
    status: string;
    statusLabel: string;
    subtotalToman: number;
    items?: CatalogOrderItem[];
    itemsCount?: number;
    createdAt?: string;
};
