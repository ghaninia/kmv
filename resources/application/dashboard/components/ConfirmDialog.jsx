import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'تأیید',
    message = 'آیا مطمئن هستید؟',
    confirmText = 'حذف',
    variant = 'danger',
    isLoading = false,
}) => {
    const styles = {
        danger: {
            icon: 'bg-red-50 text-red-600',
            button: 'bg-red-600 hover:bg-red-700 disabled:bg-red-400',
        },
        info: {
            icon: 'bg-blue-50 text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400',
        },
    };
    const style = styles[variant] ?? styles.danger;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="space-y-6">
                <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${style.icon}`}>
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-gray-600">{message}</p>
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
                    >
                        انصراف
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg text-white font-medium transition ${style.button}`}
                    >
                        {isLoading ? 'لطفاً صبر کنید...' : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
