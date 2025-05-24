import React, { useState } from 'react'
import Papa from 'papaparse'
import {
  REEVO_ACCOUNT_FIELDS,
  REEVO_CONTACT_FIELDS,
  FILE_SIZE_LIMIT,
} from './constants'
import FileSelection from './FileSelection'
import FieldMapping from './FieldMapping'

export default function ImportCSV() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [csvData, setCSVData] = useState(null)
  const [csvHeaders, setCSVHeaders] = useState([])
  const [fieldMappings, setFieldMappings] = useState({})
  const [importType, setImportType] = useState(null)
  const [showMappingUI, setShowMappingUI] = useState(false)
  const [sampleData, setSampleData] = useState({})

  const handleFileUpload = (file, type) => {
    if (!file) return

    if (file.size > FILE_SIZE_LIMIT) {
      setError('File size exceeds 10KB limit')
      return
    }

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        if (results.data.length === 0) {
          setError('CSV file is empty')
          return
        }

        const headers = Object.keys(results.data[0] || {})
        setCSVHeaders(headers)
        setCSVData(results.data)
        setImportType(type)
        setShowMappingUI(true)

        // Store sample data from first row
        setSampleData(results.data[0])

        // Create initial field mappings with automatic matches
        const targetFields =
          type === 'contacts' ? REEVO_CONTACT_FIELDS : REEVO_ACCOUNT_FIELDS
        const initialMappings = {}
        headers.forEach((header) => {
          if (targetFields.includes(header)) {
            initialMappings[header] = header
          } else {
            initialMappings[header] = 'Not mapped'
          }
        })
        setFieldMappings(initialMappings)
        setError('')
      },
      error: (error) => {
        setError(`Error parsing ${type} CSV file: ${error.message}`)
      },
    })
  }

  const handleMappingChange = (csvField, reevoField) => {
    // Create new mappings object
    const newMappings = { ...fieldMappings }

    // If selecting a Reevo field (not 'Not mapped')
    if (reevoField !== 'Not mapped') {
      // First, find any other CSV field that was mapped to this Reevo field
      Object.keys(newMappings).forEach((key) => {
        if (newMappings[key] === reevoField) {
          newMappings[key] = 'Not mapped'
        }
      })
    }

    // Set the new mapping for current field
    newMappings[csvField] = reevoField
    setFieldMappings(newMappings)
  }

  const handleUpload = async () => {
    try {
      // Transform data according to mappings
      const transformedData = csvData.map((row) => {
        const mappedRow = {}
        Object.entries(fieldMappings).forEach(([csvField, reevoField]) => {
          if (reevoField !== 'Not mapped') {
            mappedRow[reevoField] = row[csvField]
          }
        })
        return mappedRow
      })

      // Log first two rows of transformed data
      console.log('First two rows of transformed data:')
      console.log('Row 1:', transformedData[0])
      if (transformedData.length > 1) {
        console.log('Row 2:', transformedData[1])
      }

      // Here you would send transformedData to your backend
      console.log('Total rows to be uploaded:', transformedData.length)
      setSuccess('Data mapped successfully!')
      setShowMappingUI(false)
      setCSVData(null)
      setFieldMappings({})
      setSampleData({})
    } catch {
      setError('Error uploading mapped data')
    }
  }

  const handleCancel = () => {
    setShowMappingUI(false)
    setCSVData(null)
    setFieldMappings({})
    setSampleData({})
  }

  if (showMappingUI) {
    return (
      <FieldMapping
        csvHeaders={csvHeaders}
        sampleData={sampleData}
        fieldMappings={fieldMappings}
        onMappingChange={handleMappingChange}
        onCancel={handleCancel}
        onUpload={handleUpload}
        reevoFields={
          importType === 'contacts'
            ? REEVO_CONTACT_FIELDS
            : REEVO_ACCOUNT_FIELDS
        }
        error={error}
        success={success}
      />
    )
  }

  return <FileSelection onFileSelect={handleFileUpload} error={error} />
}
