'use client'

import React from 'react'
import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
  isLoading?: boolean
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center gap-4">
        {isDangerous && (
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
        )}
        <p className="text-gray-700 text-center">{message}</p>
        <div className="flex gap-3 w-full justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-lg transition font-medium disabled:opacity-50 ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[#B76E79] hover:bg-[#8E4F5A]'
            }`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmationDialog
