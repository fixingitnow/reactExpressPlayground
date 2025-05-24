import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function FieldMapping({
  csvHeaders,
  sampleData,
  fieldMappings,
  onMappingChange,
  onCancel,
  onUpload,
  reevoFields,
  error,
  success,
}) {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-6">Map Your Fields</h2>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Your field name</TableHead>
              <TableHead className="w-[200px]">Sample data</TableHead>
              <TableHead>Reevo field name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvHeaders.map((header) => (
              <TableRow key={header}>
                <TableCell className="font-medium">{header}</TableCell>
                <TableCell className="text-gray-500">
                  {sampleData[header]}
                </TableCell>
                <TableCell>
                  <Select
                    value={fieldMappings[header]}
                    onValueChange={(value) => onMappingChange(header, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not mapped">Not mapped</SelectItem>
                      {reevoFields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onUpload}>Upload</Button>
      </div>
      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-md">
          {success}
        </div>
      )}
    </div>
  )
}
