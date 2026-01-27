'use client';

import React from 'react';
import { Button } from '@/components/common/button';

interface IConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Info: (20260126 - Luphia) 通用確認對話框
const ConfirmModal: React.FC<IConfirmModalProps> = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex size-full items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex w-96 flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
        <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
        <p className="mb-6 text-sm text-slate-300">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="rounded px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            Cancel
          </button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded bg-pink-600 px-4 py-2 text-sm font-bold text-white hover:bg-pink-500"
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
