#!/usr/bin/env ts-node

import fs from 'fs'
import path from 'path'
import { Dictionary } from '../types/dictionary'
import { i18n } from '../i18n-config'

/**
 * Validates all i18n dictionary files against the Dictionary interface
 * 確保所有翻譯檔案結構一致
 */

const DICTIONARIES_DIR = path.join(__dirname, '../dictionaries')

interface ValidationResult {
  locale: string
  valid: boolean
  errors: string[]
  missing: string[]
  extra: string[]
}

/**
 * Get all nested keys from an object
 */
function getAllKeys(obj: any, prefix = ''): string[] {
  const keys: string[] = []
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys.push(...getAllKeys(obj[key], fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  
  return keys
}

/**
 * Validate a single dictionary file
 */
function validateDictionary(locale: string): ValidationResult {
  const filePath = path.join(DICTIONARIES_DIR, `${locale}.json`)
  const result: ValidationResult = {
    locale,
    valid: true,
    errors: [],
    missing: [],
    extra: []
  }

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      result.valid = false
      result.errors.push(`Dictionary file not found: ${filePath}`)
      return result
    }

    // Parse JSON
    const content = fs.readFileSync(filePath, 'utf-8')
    const dictionary = JSON.parse(content) as Dictionary

    // Load reference dictionary (zh-TW as baseline)
    const referencePath = path.join(DICTIONARIES_DIR, 'zh-TW.json')
    const referenceContent = fs.readFileSync(referencePath, 'utf-8')
    const referenceDictionary = JSON.parse(referenceContent) as Dictionary

    const currentKeys = getAllKeys(dictionary)
    const referenceKeys = getAllKeys(referenceDictionary)

    // Find missing keys
    result.missing = referenceKeys.filter(key => !currentKeys.includes(key))
    
    // Find extra keys
    result.extra = currentKeys.filter(key => !referenceKeys.includes(key))

    // Check for structural consistency
    if (result.missing.length > 0 || result.extra.length > 0) {
      result.valid = false
    }

    // Validate data types
    function validateStructure(current: any, reference: any, path = ''): void {
      for (const key in reference) {
        const currentPath = path ? `${path}.${key}` : key
        
        if (!(key in current)) {
          result.missing.push(currentPath)
          result.valid = false
          continue
        }

        const currentType = typeof current[key]
        const referenceType = typeof reference[key]

        if (currentType !== referenceType) {
          result.errors.push(`Type mismatch at ${currentPath}: expected ${referenceType}, got ${currentType}`)
          result.valid = false
        }

        if (referenceType === 'object' && reference[key] !== null) {
          validateStructure(current[key], reference[key], currentPath)
        }
      }
    }

    validateStructure(dictionary, referenceDictionary)

  } catch (error) {
    result.valid = false
    result.errors.push(`Failed to parse ${filePath}: ${error}`)
  }

  return result
}

/**
 * Main validation function
 */
function validateAllDictionaries(): boolean {
  console.log('🔍 Validating i18n dictionaries...\n')
  
  let allValid = true
  const results: ValidationResult[] = []

  for (const locale of i18n.locales) {
    const result = validateDictionary(locale)
    results.push(result)
    
    if (!result.valid) {
      allValid = false
    }
  }

  // Print results
  for (const result of results) {
    const status = result.valid ? '✅' : '❌'
    console.log(`${status} ${result.locale}`)
    
    if (!result.valid) {
      if (result.errors.length > 0) {
        console.log('  Errors:')
        result.errors.forEach(error => console.log(`    - ${error}`))
      }
      
      if (result.missing.length > 0) {
        console.log('  Missing keys:')
        result.missing.forEach(key => console.log(`    - ${key}`))
      }
      
      if (result.extra.length > 0) {
        console.log('  Extra keys:')
        result.extra.forEach(key => console.log(`    - ${key}`))
      }
      
      console.log()
    }
  }

  if (allValid) {
    console.log('\n🎉 All dictionaries are valid!')
  } else {
    console.log('\n💥 Some dictionaries have validation errors.')
    console.log('Please fix the issues above before proceeding.')
  }

  return allValid
}

// Run validation if this script is executed directly
if (require.main === module) {
  const isValid = validateAllDictionaries()
  process.exit(isValid ? 0 : 1)
}

export { validateAllDictionaries }