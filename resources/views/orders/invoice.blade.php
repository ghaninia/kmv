<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>پیش‌فاکتور {{ $order->order_number }}</title>
    <style>
        @font-face {
            font-family: 'Vazirmatn';
            src: url('{{ asset('fonts/vazirmatn/Vazirmatn-Regular.ttf') }}') format('truetype');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
        }

        @font-face {
            font-family: 'Vazirmatn';
            src: url('{{ asset('fonts/vazirmatn/Vazirmatn-Medium.ttf') }}') format('truetype');
            font-weight: 500;
            font-style: normal;
            font-display: swap;
        }

        @font-face {
            font-family: 'Vazirmatn';
            src: url('{{ asset('fonts/vazirmatn/Vazirmatn-SemiBold.ttf') }}') format('truetype');
            font-weight: 600;
            font-style: normal;
            font-display: swap;
        }

        @font-face {
            font-family: 'Vazirmatn';
            src: url('{{ asset('fonts/vazirmatn/Vazirmatn-Bold.ttf') }}') format('truetype');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
        }

        @font-face {
            font-family: 'Yekan Bakh';
            src: url('{{ asset('fonts/yekanbakh/YekanBakh-Regular.woff') }}') format('woff');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
        }

        @font-face {
            font-family: 'Yekan Bakh';
            src: url('{{ asset('fonts/yekanbakh/YekanBakh-Bold.woff') }}') format('woff');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
        }

        * { box-sizing: border-box; }

        body {
            font-family: 'Vazirmatn', Tahoma, sans-serif;
            margin: 0;
            padding: 24px;
            color: #111827;
            background: #f9fafb;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
        }

        .invoice {
            max-width: 900px;
            margin: 0 auto;
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 32px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 24px;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 2px solid #166534;
        }

        h1 {
            margin: 0 0 8px;
            font-family: 'Yekan Bakh', 'Vazirmatn', sans-serif;
            font-size: 24px;
            font-weight: 700;
            color: #14532d;
        }

        .meta, .customer {
            font-size: 14px;
            line-height: 1.8;
            color: #4b5563;
        }

        .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 999px;
            background: #ecfdf5;
            color: #166534;
            font-size: 13px;
            font-weight: 600;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
        }

        th, td {
            border: 1px solid #e5e7eb;
            padding: 10px 12px;
            text-align: right;
            font-size: 14px;
        }

        th {
            background: #f0fdf4;
            color: #14532d;
            font-weight: 600;
        }

        .totals {
            margin-top: 24px;
            display: flex;
            justify-content: flex-end;
        }

        .totals-box {
            min-width: 280px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            background: #f9fafb;
        }

        .totals-row {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 8px;
            font-size: 14px;
        }

        .totals-row.total {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #d1d5db;
            font-size: 18px;
            font-weight: 700;
            color: #14532d;
        }

        .note {
            margin-top: 24px;
            padding: 12px 16px;
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 8px;
            font-size: 14px;
            color: #92400e;
        }

        .actions {
            margin: 24px auto;
            max-width: 900px;
            display: flex;
            gap: 12px;
        }

        button {
            border: none;
            border-radius: 8px;
            padding: 10px 18px;
            font-family: inherit;
            font-size: 14px;
            cursor: pointer;
        }

        .print-btn {
            background: #166534;
            color: #fff;
        }

        .close-btn {
            background: #e5e7eb;
            color: #111827;
        }

        @media print {
            body {
                background: #fff;
                padding: 0;
            }

            .actions {
                display: none;
            }

            .invoice {
                border: none;
                border-radius: 0;
                padding: 0;
            }

            * {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="actions">
        <button class="print-btn" onclick="window.print()">چاپ پیش‌فاکتور</button>
        <button class="close-btn" onclick="window.close()">بستن</button>
    </div>

    <div class="invoice">
        <div class="header">
            <div>
                <h1>پیش‌فاکتور</h1>
                <div class="meta">
                    <div>شماره: <strong>{{ $order->order_number }}</strong></div>
                    <div>تاریخ: {{ $order->created_at->format('Y/m/d H:i') }}</div>
                    <div>کاتالوگ: {{ $order->catalog->name }}</div>
                </div>
            </div>
            <div>
                <span class="status">{{ $statusLabels[$order->status] ?? $order->status }}</span>
            </div>
        </div>

        <div class="customer">
            <strong>مشتری:</strong> {{ $order->customer_name }}<br>
            @if($order->customer_phone)
                <strong>تلفن:</strong> {{ $order->customer_phone }}<br>
            @endif
        </div>

        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>محصول</th>
                    <th>تعداد</th>
                    <th>قیمت واحد (تومان)</th>
                    <th>جمع (تومان)</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $index => $item)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $item->product_name }}</td>
                        <td>{{ number_format($item->quantity) }}</td>
                        <td>{{ number_format($item->unit_price_toman / 100) }}</td>
                        <td>{{ number_format($item->line_total_toman / 100) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals">
            <div class="totals-box">
                <div class="totals-row">
                    <span>جمع کل (دلار)</span>
                    <span>${{ number_format($order->subtotal_usd / 100, 2) }}</span>
                </div>
                <div class="totals-row total">
                    <span>جمع کل (تومان)</span>
                    <span>{{ number_format($order->subtotal_toman / 100) }} تومان</span>
                </div>
            </div>
        </div>

        @if($order->customer_note)
            <div class="note">
                <strong>توضیحات مشتری:</strong> {{ $order->customer_note }}
            </div>
        @endif
    </div>
</body>
</html>
