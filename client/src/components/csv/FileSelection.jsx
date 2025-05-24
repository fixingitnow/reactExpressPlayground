import React from 'react'
import { Card } from '@/components/ui/card'
import { UserIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline'

export default function FileSelection({ onFileSelect, error }) {
  const contactsInputRef = React.useRef(null)
  const accountsInputRef = React.useRef(null)

  const handleCardClick = (type) => {
    if (type === 'contacts') {
      contactsInputRef.current?.click()
    } else {
      accountsInputRef.current?.click()
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">
        What do you want to import?
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hidden file inputs */}
        <input
          type="file"
          ref={contactsInputRef}
          accept=".csv"
          className="hidden"
          onChange={(e) => onFileSelect(e.target.files[0], 'contacts')}
        />
        <input
          type="file"
          ref={accountsInputRef}
          accept=".csv"
          className="hidden"
          onChange={(e) => onFileSelect(e.target.files[0], 'accounts')}
        />

        {/* Contacts Card */}
        <Card
          className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => handleCardClick('contacts')}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-gray-600" />
            </div>
            <h2 className="text-lg font-medium">Contacts</h2>
            <p className="text-sm text-gray-500">CSV file from computer</p>
          </div>
        </Card>

        {/* Accounts Card */}
        <Card
          className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => handleCardClick('accounts')}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <BuildingOffice2Icon className="w-6 h-6 text-gray-600" />
            </div>
            <h2 className="text-lg font-medium">Accounts</h2>
            <p className="text-sm text-gray-500">CSV file from computer</p>
          </div>
        </Card>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  )
}
