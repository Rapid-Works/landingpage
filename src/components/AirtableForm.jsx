"use client"

import React, { useCallback, useState, useEffect, useRef } from "react"

// English translations
const en = {
  title: "Company Information Form",
    // Company Information
  companyInfo: "Company Information",
  name: "Name",
  industry: "Industry",
  businessType: "Business Type",
  slogan: "Slogan",
  customerGroups: "Customer Groups",
  customerDescription: "Customer Description",
  customerAcquisition: "Customer Acquisition",
  linkSource: "Link Source",
  productCount: "Product Count",
  websiteProductCount: "Website Product",
  customerProblem: "Customer Problem",
  solution: "Solution",
  competitors: "Competitors",
  address: "Address",

  // Founder sections
  founder1: "Founder 1",
  founder2: "Founder 2",
  founder3: "Founder 3",
  founder4: "Founder 4",
  title: "Title",
  position: "Position",
  firstName: "First Name",
  lastName: "Last Name",
  image: "Image",
  gender: "Gender",
  mobile: "Mobile",
  landline: "Landline",
  email: "Email",
  calendar: "Calendar",

  // Website Setup
  websiteSetup: "Website Setup",
  currentWebsite: "Current Website",
  addressForm: "Address Form",
  perspective: "Perspective",
  calendarLink: "Calendar Link",
  partners: "Partners",
  hasTestimonials: "Has Testimonials",
  newsletterPopupTimer: "Newsletter Popup Timer",

  // Testimonials
  testimonials: "Testimonials",
  name: "Name",
  position: "Position",
  company: "Company",
  text: "Text",

  // FAQs
  faqs: "FAQs",
  hasFAQs: "Has FAQs",
  question1: "Question 1",
  answer1: "Answer 1",
  question2: "Question 2",
  answer2: "Answer 2",
  question3: "Question 3",
  answer3: "Answer 3",

  // Visibility Bundle
  visibilityBundle: "Visibility Bundle Elements Ranking",
  logoRank: "Logo Rank",
  websiteRank: "Website Rank",
  callBackgroundRank: "Call Background Rank",
  qrCodeRank: "QR Code Rank",
  socialMediaBannerRank: "Social Media Banner Rank",
  newsletterTemplateRank: "Newsletter Template Rank",
  emailSignaturesRank: "Email Signatures Rank",
  letterTemplateRank: "Letter Template Rank",
  smartphoneScreenBackgroundRank: "Smartphone Screen Background Rank",
  desktopScreenBackgroundRank: "Desktop Screen Background Rank",
  rollUpRank: "Roll-Up Rank",
  flyerRank: "Flyer Rank",
  businessCardsRank: "Business Cards Rank",
  shirtsHoodiesRank: "Shirts & Hoodies Rank",
  pitchDeckRank: "Pitch Deck Rank",
  bookingToolIntegrationRank: "Booking Tool Integration Rank",

  // Additional Info
  additionalInfo: "Additional Info",
  companyStage: "Company Stage",
  knowsGoToMarketVoucher: "Knows GoToMarket Voucher",
  appliedForGoToMarketVoucher: "Applied for GoToMarket Voucher",
  moodGraphic: "Mood Graphic",
  additionalDocuments: "Additional Documents",
  addInfo: "Additional Info",

  // Metadata
  metadata: "Metadata",
  submissionID: "Submission ID",
  submissionDate: "Submission Date",
  language: "Language",
  formVersion: "Form Version",

  // Form actions
  submit: "Submit Form",
  submitting: "Submitting...",
  success: "Form submitted successfully!",
  next: "Next",
  previous: "Previous",

  // Dropdown options
  selectOption: "Select an option",
  b2b: "B2B",
  b2c: "B2C",
  both: "Both",
  other: "Other",
  searchEngines: "Search Engines",
  link: "Link",
  male: "Male",
  female: "Female",
  diverse: "Diverse",
  du: "Du",
  sie: "Sie",
  ich: "Ich",
  wir: "Wir",
  idea: "Idea",
  founded: "Founded",
  hasCustomers: "Has Customers",
  german: "German",
  english: "English",

  // Language toggle
  switchLanguage: "Sprache wechseln zu Deutsch",

  // New translations
  selectedFile: "Selected file",
  uploadingFiles: "Uploading files...",
  fileUploadError: "Error uploading file",
  uploadComplete: "Upload complete",

  // Progress
  progressOf: "of",
  completeYourProfile: "Complete your profile",
  step: "Step",

  // New
  founders: "Founders",
  founder: "Founder",
  review: "Review & Submit",
}

// German translations
const de = {
  title: "Unternehmensinformationsformular",
  // Company Information
  companyInfo: "Unternehmensinformationen",
  name: "Name",
  industry: "Branche",
  businessType: "Geschäftstyp",
  slogan: "Slogan",
  customerGroups: "Kundengruppen",
  customerDescription: "Kundenbeschreibung",
  customerAcquisition: "Kundenakquise",
  linkSource: "Link-Quelle",
  productCount: "Produktanzahl",
  websiteProductCount: "Website-Produktanzahl",
  customerProblem: "Kundenproblem",
  solution: "Lösung",
  competitors: "Wettbewerber",
  address: "Adresse",

  // Founder sections
  founder1: "Gründer 1",
  founder2: "Gründer 2",
  founder3: "Gründer 3",
  founder4: "Gründer 4",
  title: "Titel",
  position: "Position",
  firstName: "Vorname",
  lastName: "Nachname",
  image: "Bild",
  gender: "Geschlecht",
  mobile: "Mobiltelefon",
  landline: "Festnetz",
  email: "E-Mail",
  calendar: "Kalender",
    
    // Website Setup
  websiteSetup: "Website-Einrichtung",
  currentWebsite: "Aktuelle Website",
  addressForm: "Anredeform",
  perspective: "Perspektive",
  calendarLink: "Kalender-Link",
  partners: "Partner",
  hasTestimonials: "Hat Testimonials",
  newsletterPopupTimer: "Newsletter-Popup-Timer",

  // Testimonials
  testimonials: "Testimonials",
  name: "Name",
  position: "Position",
  company: "Unternehmen",
  text: "Text",

  // FAQs
  faqs: "FAQs",
  hasFAQs: "Hat FAQs",
  question1: "Frage 1",
  answer1: "Antwort 1",
  question2: "Frage 2",
  answer2: "Antwort 2",
  question3: "Frage 3",
  answer3: "Antwort 3",

  // Visibility Bundle
  visibilityBundle: "Sichtbarkeitspaket-Elemente Ranking",
  logoRank: "Logo Rang",
  websiteRank: "Website Rang",
  callBackgroundRank: "Anrufhintergrund Rang",
  qrCodeRank: "QR-Code Rang",
  socialMediaBannerRank: "Social-Media-Banner Rang",
  newsletterTemplateRank: "Newsletter-Vorlage Rang",
  emailSignaturesRank: "E-Mail-Signaturen Rang",
  letterTemplateRank: "Briefvorlage Rang",
  smartphoneScreenBackgroundRank: "Smartphone-Bildschirmhintergrund Rang",
  desktopScreenBackgroundRank: "Desktop-Bildschirmhintergrund Rang",
  rollUpRank: "Roll-Up Rang",
  flyerRank: "Flyer Rang",
  businessCardsRank: "Visitenkarten Rang",
  shirtsHoodiesRank: "Shirts & Hoodies Rang",
  pitchDeckRank: "Pitch-Deck Rang",
  bookingToolIntegrationRank: "Buchungstool-Integration Rang",

  // Additional Info
  additionalInfo: "Zusätzliche Informationen",
  companyStage: "Unternehmensphase",
  knowsGoToMarketVoucher: "Kennt GoToMarket-Gutschein",
  appliedForGoToMarketVoucher: "Hat GoToMarket-Gutschein beantragt",
  moodGraphic: "Stimmungsgrafik",
  additionalDocuments: "Zusätzliche Dokumente",
  addInfo: "Zusätzliche Informationen",

  // Metadata
  metadata: "Metadaten",
  submissionID: "Einreichungs-ID",
  submissionDate: "Einreichungsdatum",
  language: "Sprache",
  formVersion: "Formularversion",

  // Form actions
  submit: "Formular absenden",
  submitting: "Wird gesendet...",
  success: "Formular erfolgreich übermittelt!",
  next: "Weiter",
  previous: "Zurück",

  // Dropdown options
  selectOption: "Option auswählen",
  b2b: "B2B",
  b2c: "B2B",
  both: "Beide",
  other: "Andere",
  searchEngines: "Suchmaschinen",
  link: "Link",
  male: "Männlich",
  female: "Weiblich",
  diverse: "Divers",
  du: "Du",
  sie: "Sie",
  ich: "Ich",
  wir: "Wir",
  idea: "Idee",
  founded: "Gegründet",
  hasCustomers: "Hat Kunden",
  german: "Deutsch",
  english: "Englisch",

  // Language toggle
  switchLanguage: "Switch language to English",

  // New translations
  selectedFile: "Ausgewählte Datei",
  uploadingFiles: "Dateien werden hochgeladen...",
  fileUploadError: "Fehler beim Hochladen der Datei",
  uploadComplete: "Upload abgeschlossen",

  // Progress
  progressOf: "von",
  completeYourProfile: "Vervollständigen Sie Ihr Profil",
  step: "Schritt",

  // New
  founders: "Gründer",
  founder: "Gründer",
  review: "Überprüfen & Absenden",
}

const VisibilityFormulaForm = () => {
  // Add language state
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const t = currentLanguage === "en" ? en : de

  // Form sections
  const sections = [
    { id: "companyInfo", title: t.companyInfo },
    { id: "founders", title: t.founders },
    { id: "websiteSetup", title: t.websiteSetup },
    { id: "testimonials", title: t.testimonials },
    { id: "faqs", title: t.faqs },
    { id: "visibilityBundle", title: t.visibilityBundle },
    { id: "additionalInfo", title: t.additionalInfo },
    { id: "review", title: t.review },
  ]

  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState({
    // Company Information
    name: "",
    industry: "",
    businessType: "",
    slogan: "",
    customerGroups: "",
    customerDescription: "",
    customerAcquisition: "",
    linkSource: "",
    productCount: "",
    websiteProductCount: "",
    customerProblem: "",
    solution: "",
    competitors: "",
    address: "",

    // Founders (as an array for dynamic addition)
    founders: [
      {
        title: "",
        position: "",
        firstName: "",
        lastName: "",
        image: null,
        gender: "",
        mobile: "",
        landline: "",
        email: "",
        calendar: "",
      },
    ],

    // Website Setup
    currentWebsite: "",
    addressForm: "",
    perspective: "",
    calendarLink: "",
    partners: "",
    hasTestimonials: false,
    newsletterPopupTimer: "",
    
    // Testimonials
    testimonial1Name: "",
    testimonial1Position: "",
    testimonial1Company: "",
    testimonial1Text: "",
    testimonial1Image: null,
    testimonial2Name: "",
    testimonial2Position: "",
    testimonial2Company: "",
    testimonial2Text: "",
    testimonial2Image: null,
    testimonial3Name: "",
    testimonial3Position: "",
    testimonial3Company: "",
    testimonial3Text: "",
    testimonial3Image: null,
    
    // FAQs
    hasFAQs: false,
    faq1Question: "",
    faq1Answer: "",
    faq2Question: "",
    faq2Answer: "",
    faq3Question: "",
    faq3Answer: "",
    
    // Visibility Bundle Elements Ranking
    logoRank: "",
    websiteRank: "",
    callBackgroundRank: "",
    qrCodeRank: "",
    socialMediaBannerRank: "",
    newsletterTemplateRank: "",
    emailSignaturesRank: "",
    letterTemplateRank: "",
    smartphoneScreenBackgroundRank: "",
    desktopScreenBackgroundRank: "",
    rollUpRank: "",
    flyerRank: "",
    businessCardsRank: "",
    shirtsHoodiesRank: "",
    pitchDeckRank: "",
    bookingToolIntegrationRank: "",
    
    // Additional Info
    companyStage: "",
    knowsGoToMarketVoucher: false,
    appliedForGoToMarketVoucher: false,
    moodGraphic: null,
    additionalDocuments: null,
    additionalInfo: "",
    
    // Metadata
    submissionID: "",
    submissionDate: "",
    language: "",
    formVersion: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(false)

  // Refs for animation
  const formRef = useRef(null)
  const sectionRefs = useRef([])

  // Airtable configuration
  const airtableConfig = {
    apiKey: process.env.REACT_APP_FORM_AIRTABLE_API_KEY,
    baseId: process.env.REACT_APP_FORM_AIRTABLE_BASE_ID,
    tableName: "Table 1", // This could also be an env var if it changes per environment
  }

  // Cloudinary configuration
  const cloudinaryConfig = {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
  }

  // Field name mapping (JavaScript variable name to Airtable field name)
  const fieldMapping = {
    // Company Information
    name: "Name",
    industry: "Industry",
    businessType: "Business Type",
    slogan: "Slogan",
    customerGroups: "Customer Groups",
    customerDescription: "Customer Description",
    customerAcquisition: "Customer Acquisition",
    linkSource: "Link Source",
    productCount: "Product Count",
    websiteProductCount: "Website Product Count",
    customerProblem: "Customer Problem",
    solution: "Solution",
    competitors: "Competitors",
    address: "Address",
    
    // Website Setup
    currentWebsite: "Current Website",
    addressForm: "Address Form",
    perspective: "Perspective",
    calendarLink: "Calendar Link",
    partners: "Partners",
    hasTestimonials: "Has Testimonials",
    newsletterPopupTimer: "Newsletter Popup Timer",
    
    // Testimonials
    testimonial1Name: "Testimonial 1 Name",
    testimonial1Position: "Testimonial 1 Position",
    testimonial1Company: "Testimonial 1 Company",
    testimonial1Text: "Testimonial 1 Text",
    testimonial1Image: "Testimonial 1 Image",
    testimonial2Name: "Testimonial 2 Name",
    testimonial2Position: "Testimonial 2 Position",
    testimonial2Company: "Testimonial 2 Company",
    testimonial2Text: "Testimonial 2 Text",
    testimonial2Image: "Testimonial 2 Image",
    testimonial3Name: "Testimonial 3 Name",
    testimonial3Position: "Testimonial 3 Position",
    testimonial3Company: "Testimonial 3 Company",
    testimonial3Text: "Testimonial 3 Text",
    testimonial3Image: "Testimonial 3 Image",
    
    // FAQs
    hasFAQs: "Has FAQs",
    faq1Question: "FAQ 1 Question",
    faq1Answer: "FAQ 1 Answer",
    faq2Question: "FAQ 2 Question",
    faq2Answer: "FAQ 2 Answer",
    faq3Question: "FAQ 3 Question",
    faq3Answer: "FAQ 3 Answer",
    
    // Visibility Bundle Elements Ranking
    logoRank: "Logo Rank",
    websiteRank: "Website Rank",
    callBackgroundRank: "Call Background Rank",
    qrCodeRank: "QR Code Rank",
    socialMediaBannerRank: "Social Media Banner Rank",
    newsletterTemplateRank: "Newsletter Template Rank",
    emailSignaturesRank: "Email Signatures Rank",
    letterTemplateRank: "Letter Template Rank",
    smartphoneScreenBackgroundRank: "Smartphone Screen Background Rank",
    desktopScreenBackgroundRank: "Desktop Screen Background Rank",
    rollUpRank: "Roll-Up Rank",
    flyerRank: "Flyer Rank",
    businessCardsRank: "Business Cards Rank",
    shirtsHoodiesRank: "Shirts & Hoodies Rank",
    pitchDeckRank: "Pitch Deck Rank",
    bookingToolIntegrationRank: "Booking Tool Integration Rank",
    
    // Additional Info
    companyStage: "Company Stage",
    knowsGoToMarketVoucher: "Knows GoToMarket Voucher",
    appliedForGoToMarketVoucher: "Applied for GoToMarket Voucher",
    moodGraphic: "Mood Graphic",
    additionalDocuments: "Additional Documents",
    additionalInfo: "Additional Info",
    
    // Metadata
    submissionID: "Submission ID",
    submissionDate: "Submission Date",
    language: "Language",
    formVersion: "Form Version",
  }

  // Improved Cloudinary upload function
  const uploadToCloudinary = async (file) => {
    if (!file) return null

    // console.log(`Starting upload for file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", cloudinaryConfig.uploadPreset)

    try {
      const url = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`
      // console.log(`Uploading to: ${url}`)

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      })

      const responseText = await response.text()
      // console.log("Raw response:", responseText)

      if (!response.ok) {
        throw new Error(`Upload failed: ${responseText}`)
      }

      const data = JSON.parse(responseText)
      // console.log("Upload successful, received URL:", data.secure_url)

      return {
        url: data.secure_url,
        filename: file.name,
      }
    } catch (error) {
      console.error("Error during upload:", error)
      throw error
    }
  }

  // Modified handle change for file inputs
  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target

    if (type === "file" && files.length > 0) {
      setFormData((prevState) => ({
      ...prevState,
        [name]: files[0],
      }))
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }, [])

  // Function to add a new founder
  const addFounder = () => {
    if (formData.founders.length >= 4) return // Limit to 4 founders

    setFormData((prevState) => ({
      ...prevState,
      founders: [
        ...prevState.founders,
        {
          title: "",
          position: "",
          firstName: "",
          lastName: "",
          image: null,
          gender: "",
          mobile: "",
          landline: "",
          email: "",
          calendar: "",
        },
      ],
    }))
  }

  // Function to remove a founder
  const removeFounder = (index) => {
    if (formData.founders.length <= 1) return // Keep at least one founder

    setFormData((prevState) => ({
      ...prevState,
      founders: prevState.founders.filter((_, i) => i !== index),
    }))
  }

  // Modified handleChange for array fields
  const handleFounderChange = (index, field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      founders: prevState.founders.map((founder, i) => (i === index ? { ...founder, [field]: value } : founder)),
    }))
  }

  // Navigation functions
  const goToNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentSection])

  // Add this near the other useEffect hooks
  useEffect(() => {
    // This effect is intentionally empty to memoize the sections
    // and prevent unnecessary re-renders
  }, [formData, currentLanguage])

  // Modified submit function to handle file uploads
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    setUploadingFiles(true)

    try {
      // First upload all files to Cloudinary
      const fileFields = [
        "testimonial1Image",
        "testimonial2Image",
        "testimonial3Image",
        "moodGraphic",
        "additionalDocuments",
      ]

      // Add founder images to fileFields
      formData.founders.forEach((founder, index) => {
        if (founder.image instanceof File) {
          fileFields.push(`founder${index + 1}Image`)
          // Store the file in a format the upload function expects
          formData[`founder${index + 1}Image`] = founder.image
        }
      })

      const fileUploads = {}

      // Track upload progress
      let filesUploaded = 0
      const totalFiles = fileFields.filter((field) => formData[field]).length

      // Upload each file
      for (const field of fileFields) {
        if (formData[field]) {
          try {
            const fileData = await uploadToCloudinary(formData[field])
            fileUploads[field] = fileData
            filesUploaded++
          } catch (error) {
            console.error(`Error uploading ${field}:`, error)
            setError(`Failed to upload ${field}. Please try again.`)
            setLoading(false)
            setUploadingFiles(false)
            return
          }
        }
      }

      setUploadingFiles(false)

      // Prepare data for Airtable, including the file URLs
      const dataWithFileUrls = {
        ...formData,
        ...fileUploads,
      }

      // Now prepare the data for Airtable submission
      const fieldsToSubmit = prepareDataForAirtable(dataWithFileUrls)
      
      // Submit to Airtable
      const response = await submitToAirtable(fieldsToSubmit)
      
      // console.log("Airtable response:", response)
      setSuccess(true)
      // Optional: Reset form after successful submission
      // resetForm();
    } catch (err) {
      console.error("Error submitting to Airtable:", err)
      setError(err.message || "Failed to submit form. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Modified prepare data function with the simplified attachment format for all image/document fields
  const prepareDataForAirtable = (dataWithFileUrls) => {
    const formattedData = {};
    
    Object.entries(dataWithFileUrls).forEach(([key, value]) => {
      if (value !== null && value !== '' && fieldMapping[key]) {
        // Handle numeric fields
        if (['Customer Groups', 'Product Count', 'Website Product Count', 'Newsletter Popup Timer']
            .includes(fieldMapping[key]) || fieldMapping[key].includes('Rank')) {
          formattedData[fieldMapping[key]] = Number(value);
        }
        // Handle attachments
        else if (Array.isArray(value) && value.length > 0 && value[0].url) {
          formattedData[fieldMapping[key]] = value.map(item => ({url: item.url}));
        }
        // Handle other fields
        else {
          formattedData[fieldMapping[key]] = value;
        }
      }
    });
    
    return formattedData;
  };

  const submitToAirtable = async (fields) => {
    const url = `https://api.airtable.com/v0/${airtableConfig.baseId}/${encodeURIComponent(airtableConfig.tableName)}`
    
    // console.log("Submitting to Airtable with fields:", JSON.stringify(fields, null, 2))
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${airtableConfig.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error("Airtable error response:", errorData)
      throw new Error(errorData.error?.message || "Failed to submit to Airtable")
    }

    return await response.json()
  }

  const resetForm = () => {
    // Reset the form data to initial state
    setFormData({
      // Company Information
      name: "",
      industry: "",
      businessType: "",
      slogan: "",
      customerGroups: "",
      customerDescription: "",
      customerAcquisition: "",
      linkSource: "",
      productCount: "",
      websiteProductCount: "",
      customerProblem: "",
      solution: "",
      competitors: "",
      address: "",

      // Founders
      founders: [
        {
          title: "",
          position: "",
          firstName: "",
          lastName: "",
          image: null,
          gender: "",
          mobile: "",
          landline: "",
          email: "",
          calendar: "",
        },
      ],
      
      // Website Setup
      currentWebsite: "",
      addressForm: "",
      perspective: "",
      calendarLink: "",
      partners: "",
      hasTestimonials: false,
      newsletterPopupTimer: "",
      
      // Testimonials
      testimonial1Name: "",
      testimonial1Position: "",
      testimonial1Company: "",
      testimonial1Text: "",
      testimonial1Image: null,
      testimonial2Name: "",
      testimonial2Position: "",
      testimonial2Company: "",
      testimonial2Text: "",
      testimonial2Image: null,
      testimonial3Name: "",
      testimonial3Position: "",
      testimonial3Company: "",
      testimonial3Text: "",
      testimonial3Image: null,
      
      // FAQs
      hasFAQs: false,
      faq1Question: "",
      faq1Answer: "",
      faq2Question: "",
      faq2Answer: "",
      faq3Question: "",
      faq3Answer: "",
      
      // Visibility Bundle Elements Ranking
      logoRank: "",
      websiteRank: "",
      callBackgroundRank: "",
      qrCodeRank: "",
      socialMediaBannerRank: "",
      newsletterTemplateRank: "",
      emailSignaturesRank: "",
      letterTemplateRank: "",
      smartphoneScreenBackgroundRank: "",
      desktopScreenBackgroundRank: "",
      rollUpRank: "",
      flyerRank: "",
      businessCardsRank: "",
      shirtsHoodiesRank: "",
      pitchDeckRank: "",
      bookingToolIntegrationRank: "",
      
      // Additional Info
      companyStage: "",
      knowsGoToMarketVoucher: false,
      appliedForGoToMarketVoucher: false,
      moodGraphic: null,
      additionalDocuments: null,
      additionalInfo: "",
      
      // Metadata
      submissionID: "",
      submissionDate: "",
      language: "",
      formVersion: "",
    })
  }

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === "en" ? "de" : "en")
    // Update the language field in the form
    setFormData((prevData) => ({
      ...prevData,
      language: currentLanguage === "en" ? "German" : "English",
    }))
  }

  // Helper component for input fields
  const InputField = React.memo(
    ({ label, name, type = "text", options = [], value, onChange, formData }) => {
      // Create a ref for the input element
      const inputRef = useRef(null)

      // Use useEffect to maintain focus after render
      useEffect(() => {
        // If this input is focused, keep it focused after render
        if (document.activeElement && document.activeElement.id === name && inputRef.current) {
          inputRef.current.focus()

          // For text inputs, preserve cursor position
          if (inputRef.current.setSelectionRange && (type === "text" || type === "textarea")) {
            const cursorPosition = inputRef.current.selectionStart
            inputRef.current.setSelectionRange(cursorPosition, cursorPosition)
          }
        }
      })

      // For file inputs, get the file data directly from formData
      const fileData = type === "file" ? formData?.[name] : null
      const filePreviewUrl =
        fileData && fileData.type && fileData.type.startsWith("image/") ? URL.createObjectURL(fileData) : null

      if (type === "select") {
      return (
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-800 mb-2" htmlFor={name}>
            {label}
          </label>
          <select
            id={name}
            name={name}
              value={value}
              onChange={onChange}
              className="w-full px-4 py-3 text-lg border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-transparent"
              ref={inputRef}
            >
              <option value="">{t.selectOption}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                  {t[option.toLowerCase().replace(/\s+/g, "")] || option}
              </option>
            ))}
          </select>
        </div>
        )
      } else if (type === "textarea") {
      return (
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-800 mb-2" htmlFor={name}>
            {label}
          </label>
          <textarea
            id={name}
            name={name}
              value={value}
              onChange={onChange}
            rows={4}
              className="w-full px-4 py-3 text-lg border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-transparent resize-none"
              ref={inputRef}
          />
        </div>
        )
      } else if (type === "checkbox") {
      return (
          <div className="mb-6 flex items-center">
          <input
            id={name}
            name={name}
            type="checkbox"
              checked={value}
              onChange={onChange}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              ref={inputRef}
            />
            <label className="ml-3 block text-lg text-gray-800" htmlFor={name}>
            {label}
          </label>
        </div>
        )
      } else if (type === "file") {
      return (
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-800 mb-2" htmlFor={name}>
            {label}
          </label>
            <div className="relative">
              <input id={name} name={name} type="file" onChange={onChange} className="hidden" ref={inputRef} />
              <label
                htmlFor={name}
                className="flex items-center justify-center w-full px-4 py-3 text-lg border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
              >
                {fileData ? fileData.name : "Choose a file..."}
              </label>
            </div>
            {filePreviewUrl && (
              <div className="mt-2">
                <img
                  src={filePreviewUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="mt-2 h-24 object-contain rounded"
          />
        </div>
            )}
          </div>
        )
    } else {
      return (
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-800 mb-2" htmlFor={name}>
            {label}
          </label>
          <input
            id={name}
            name={name}
            type={type}
              value={value}
              onChange={onChange}
              className="w-full px-4 py-3 text-lg border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-transparent"
              ref={inputRef}
          />
        </div>
        )
      }
    },
    (prevProps, nextProps) => {
      // Custom comparison function for React.memo
      // Only re-render if these specific props change
  return (
        prevProps.value === nextProps.value &&
        prevProps.label === nextProps.label &&
        prevProps.type === nextProps.type &&
        // For file inputs, we need to check if the file has changed
        (prevProps.type !== "file" ||
          prevProps.formData?.[prevProps.name]?.name === nextProps.formData?.[nextProps.name]?.name)
      )
    },
  )

  // Change the MemoizedInputField useCallback to include t in the dependencies
  const MemoizedInputField = useCallback(InputField, [t])

  // Render the current section
  const renderSection = () => {
    const section = sections[currentSection]

    switch (section.id) {
      case "companyInfo":
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6">{t.companyInfo}</h2>
            <MemoizedInputField label={t.name} name="name" value={formData.name} onChange={handleChange} required />
            <MemoizedInputField label={t.industry} name="industry" value={formData.industry} onChange={handleChange} />
            <MemoizedInputField
              label={t.businessType}
            name="businessType" 
            type="select" 
              options={["B2B", "B2C", "Both", "Other"]}
              value={formData.businessType}
              onChange={handleChange}
            />
            <MemoizedInputField label={t.slogan} name="slogan" value={formData.slogan} onChange={handleChange} />
            <MemoizedInputField
              label={t.customerGroups}
              name="customerGroups"
              type="number"
              value={formData.customerGroups}
              onChange={handleChange}
            />
            <MemoizedInputField
              label={t.customerDescription}
              name="customerDescription"
              value={formData.customerDescription}
              onChange={handleChange}
            />
            <MemoizedInputField
              label={t.customerAcquisition}
            name="customerAcquisition" 
            type="select" 
              options={["Search Engines", "Link", "Both"]}
              value={formData.customerAcquisition}
              onChange={handleChange}
            />
            <MemoizedInputField
              label={t.linkSource}
              name="linkSource"
              value={formData.linkSource}
              onChange={handleChange}
            />
            <MemoizedInputField
              label={t.productCount}
              name="productCount"
              type="number"
              value={formData.productCount}
              onChange={handleChange}
            />
            <MemoizedInputField
              label={t.websiteProductCount}
              name="websiteProductCount"
              type="number"
              value={formData.websiteProductCount}
              onChange={handleChange}
            />
            <MemoizedInputField
              label={t.customerProblem}
              name="customerProblem"
              type="textarea"
              value={formData.customerProblem}
              onChange={handleChange}
            />
            <MemoizedInputField
              label={t.solution}
              name="solution"
              type="textarea"
              value={formData.solution}
              onChange={handleChange}
            />
            <MemoizedInputField
              label={t.competitors}
              name="competitors"
              type="textarea"
              value={formData.competitors}
              onChange={handleChange}
            />
            <MemoizedInputField
              label={t.address}
              name="address"
              type="textarea"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        )
      case "founders":
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6">{t.founders}</h2>

            {formData.founders.map((founder, index) => (
              <div key={index} className="mb-8 p-6 bg-gray-50 rounded-lg relative">
                <h3 className="text-xl font-medium mb-4">
                  {t.founder} {index + 1}
                </h3>

                {/* Remove button */}
                {formData.founders.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFounder(index)}
                    className="absolute top-4 right-4 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                    aria-label="Remove founder"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg font-medium text-gray-800 mb-2" htmlFor={`founder-${index}-title`}>
                      {t.title}
                    </label>
                    <input
                      id={`founder-${index}-title`}
                      type="text"
                      value={founder.title}
                      onChange={(e) => handleFounderChange(index, "title", e.target.value)}
                      className="w-full px-4 py-3 text-lg border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-transparent"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-lg font-medium text-gray-800 mb-2"
                      htmlFor={`founder-${index}-position`}
                    >
                      {t.position}
                    </label>
                    <input
                      id={`founder-${index}-position`}
                      type="text"
                      value={founder.position}
                      onChange={(e) => handleFounderChange(index, "position", e.target.value)}
                      className="w-full px-4 py-3 text-lg border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-transparent"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-lg font-medium text-gray-800 mb-2"
                      htmlFor={`founder-${index}-firstName`}
                    >
                      {t.firstName}
                    </label>
                    <input
                      id={`founder-${index}-firstName`}
                      type="text"
                      value={founder.firstName}
                      onChange={(e) => handleFounderChange(index, "firstName", e.target.value)}
                      className="w-full px-4 py-3 text-lg border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-transparent"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-lg font-medium text-gray-800 mb-2"
                      htmlFor={`founder-${index}-lastName`}
                    >
                      {t.lastName}
                    </label>
                    <input
                      id={`founder-${index}-lastName`}
                      type="text"
                      value={founder.lastName}
                      onChange={(e) => handleFounderChange(index, "lastName", e.target.value)}
                      className="w-full px-4 py-3 text-lg border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-lg font-medium text-gray-800 mb-2" htmlFor={`founder-${index}-image`}>
                      {t.image}
                    </label>
                    <div className="relative">
                      <input
                        id={`founder-${index}-image`}
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFounderChange(index, "image", e.target.files[0])
                          }
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor={`founder-${index}-image`}
                        className="flex items-center justify-center w-full px-4 py-3 text-lg border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                      >
                        {founder.image ? founder.image.name : "Choose a file..."}
                      </label>
                    </div>
                    {founder.image && founder.image.type && founder.image.type.startsWith("image/") && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(founder.image) || "/placeholder.svg"}
                          alt="Preview"
                          className="mt-2 h-24 object-contain rounded"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-800 mb-2" htmlFor={`founder-${index}-gender`}>
                      {t.gender}
                    </label>
                    <select
                      id={`founder-${index}-gender`}
                      value={founder.gender}
                      onChange={(e) => handleFounderChange(index, "gender", e.target.value)}
                      className="w-full px-4 py-3 text-lg border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-transparent"
                    >
                      <option value="">{t.selectOption}</option>
                      <option value="Male">{t.male}</option>
                      <option value="Female">{t.female}</option>
                      <option value="Diverse">{t.diverse}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-800 mb-2" htmlFor={`founder-${index}-mobile`}>
                      {t.mobile}
                    </label>
                    <input
                      id={`founder-${index}-mobile`}
                      type="tel"
                      value={founder.mobile}
                      onChange={(e) => handleFounderChange(index, "mobile", e.target.value)}
                      className="w-full px-4 py-3 text-lg border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-transparent"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-lg font-medium text-gray-800 mb-2"
                      htmlFor={`founder-${index}-landline`}
                    >
                      {t.landline}
                    </label>
                    <input
                      id={`founder-${index}-landline`}
                      type="tel"
                      value={founder.landline}
                      onChange={(e) => handleFounderChange(index, "landline", e.target.value)}
                      className="w-full px-4 py-3 text-lg border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-800 mb-2" htmlFor={`founder-${index}-email`}>
                      {t.email}
                    </label>
                    <input
                      id={`founder-${index}-email`}
                      type="email"
                      value={founder.email}
                      onChange={(e) => handleFounderChange(index, "email", e.target.value)}
                      className="w-full px-4 py-3 text-lg border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-transparent"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-lg font-medium text-gray-800 mb-2"
                      htmlFor={`founder-${index}-calendar`}
                    >
                      {t.calendar}
                    </label>
                    <input
                      id={`founder-${index}-calendar`}
                      type="url"
                      value={founder.calendar}
                      onChange={(e) => handleFounderChange(index, "calendar", e.target.value)}
                      className="w-full px-4 py-3 text-lg border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add founder button */}
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={addFounder}
                disabled={formData.founders.length >= 4}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  formData.founders.length >= 4
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Another Founder {formData.founders.length >= 4 ? "(Max 4)" : ""}
              </button>
            </div>
          </div>
        )
      case "websiteSetup":
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6">{t.websiteSetup}</h2>
            <MemoizedInputField
              label={t.currentWebsite}
              name="currentWebsite"
              type="url"
              value={formData.currentWebsite}
              onChange={handleChange}
            />
            <MemoizedInputField
              label={t.addressForm}
            name="addressForm" 
            type="select" 
              options={["Du", "Sie"]}
              value={formData.addressForm}
              onChange={handleChange}
          />
            <MemoizedInputField
              label={t.perspective}
            name="perspective" 
            type="select" 
              options={["Ich", "Wir"]}
              value={formData.perspective}
              onChange={handleChange}
            />
            <MemoizedInputField
              label={t.calendarLink}
              name="calendarLink"
              type="url"
              value={formData.calendarLink}
              onChange={handleChange}
            />
            <MemoizedInputField
              label={t.partners}
              name="partners"
              type="textarea"
              value={formData.partners}
              onChange={handleChange}
            />
            <MemoizedInputField
              label={t.hasTestimonials}
              name="hasTestimonials"
              type="checkbox"
              checked={formData.hasTestimonials}
              onChange={handleChange}
            />
            <MemoizedInputField
              label={t.newsletterPopupTimer}
              name="newsletterPopupTimer"
              type="number"
              value={formData.newsletterPopupTimer}
              onChange={handleChange}
            />
          </div>
        )
      case "testimonials":
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6">{t.testimonials}</h2>
            <div className="p-4 mb-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Testimonial 1</h3>
              <MemoizedInputField
                label={t.name}
                name="testimonial1Name"
                value={formData.testimonial1Name}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.position}
                name="testimonial1Position"
                value={formData.testimonial1Position}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.company}
                name="testimonial1Company"
                value={formData.testimonial1Company}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.text}
                name="testimonial1Text"
                type="textarea"
                value={formData.testimonial1Text}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.image}
                name="testimonial1Image"
                type="file"
                onChange={handleChange}
                formData={formData}
              />
            </div>

            <div className="p-4 mb-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Testimonial 2</h3>
              <MemoizedInputField
                label={t.name}
                name="testimonial2Name"
                value={formData.testimonial2Name}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.position}
                name="testimonial2Position"
                value={formData.testimonial2Position}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.company}
                name="testimonial2Company"
                value={formData.testimonial2Company}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.text}
                name="testimonial2Text"
                type="textarea"
                value={formData.testimonial2Text}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.image}
                name="testimonial2Image"
                type="file"
                onChange={handleChange}
                formData={formData}
              />
            </div>

            <div className="p-4 mb-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Testimonial 3</h3>
              <MemoizedInputField
                label={t.name}
                name="testimonial3Name"
                value={formData.testimonial3Name}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.position}
                name="testimonial3Position"
                value={formData.testimonial3Position}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.company}
                name="testimonial3Company"
                value={formData.testimonial3Company}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.text}
                name="testimonial3Text"
                type="textarea"
                value={formData.testimonial3Text}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.image}
                name="testimonial3Image"
                type="file"
                onChange={handleChange}
                formData={formData}
              />
            </div>
          </div>
        )
      case "faqs":
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6">{t.faqs}</h2>
            <MemoizedInputField
              label={t.hasFAQs}
              name="hasFAQs"
              type="checkbox"
              checked={formData.hasFAQs}
              onChange={handleChange}
            />

            {formData.hasFAQs && (
              <>
                <div className="p-4 mb-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-medium mb-4">FAQ 1</h3>
                  <MemoizedInputField
                    label={t.question1}
                    name="faq1Question"
                    value={formData.faq1Question}
                    onChange={handleChange}
                  />
                  <MemoizedInputField
                    label={t.answer1}
                    name="faq1Answer"
                    type="textarea"
                    value={formData.faq1Answer}
                    onChange={handleChange}
                  />
                </div>

                <div className="p-4 mb-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-medium mb-4">FAQ 2</h3>
                  <MemoizedInputField
                    label={t.question2}
                    name="faq2Question"
                    value={formData.faq2Question}
                    onChange={handleChange}
                  />
                  <MemoizedInputField
                    label={t.answer2}
                    name="faq2Answer"
                    type="textarea"
                    value={formData.faq2Answer}
                    onChange={handleChange}
                  />
                </div>

                <div className="p-4 mb-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-medium mb-4">FAQ 3</h3>
                  <MemoizedInputField
                    label={t.question3}
                    name="faq3Question"
                    value={formData.faq3Question}
                    onChange={handleChange}
                  />
                  <MemoizedInputField
                    label={t.answer3}
                    name="faq3Answer"
                    type="textarea"
                    value={formData.faq3Answer}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </div>
        )
      case "visibilityBundle":
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6">{t.visibilityBundle}</h2>
            <p className="mb-6 text-gray-600">Rank these items from 1 (most important) to 16 (least important)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MemoizedInputField
                label={t.logoRank}
                name="logoRank"
                type="number"
                min="1"
                max="16"
                value={formData.logoRank}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.websiteRank}
                name="websiteRank"
                type="number"
                min="1"
                max="16"
                value={formData.websiteRank}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.callBackgroundRank}
                name="callBackgroundRank"
                type="number"
                min="1"
                max="16"
                value={formData.callBackgroundRank}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.qrCodeRank}
                name="qrCodeRank"
                type="number"
                min="1"
                max="16"
                value={formData.qrCodeRank}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.socialMediaBannerRank}
                name="socialMediaBannerRank"
                type="number"
                min="1"
                max="16"
                value={formData.socialMediaBannerRank}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.newsletterTemplateRank}
                name="newsletterTemplateRank"
                type="number"
                min="1"
                max="16"
                value={formData.newsletterTemplateRank}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.emailSignaturesRank}
                name="emailSignaturesRank"
                type="number"
                min="1"
                max="16"
                value={formData.emailSignaturesRank}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.letterTemplateRank}
                name="letterTemplateRank"
                type="number"
                min="1"
                max="16"
                value={formData.letterTemplateRank}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.smartphoneScreenBackgroundRank}
                name="smartphoneScreenBackgroundRank"
                type="number"
                min="1"
                max="16"
                value={formData.smartphoneScreenBackgroundRank}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.desktopScreenBackgroundRank}
                name="desktopScreenBackgroundRank"
                type="number"
                min="1"
                max="16"
                value={formData.desktopScreenBackgroundRank}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.rollUpRank}
                name="rollUpRank"
                type="number"
                min="1"
                max="16"
                value={formData.rollUpRank}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.flyerRank}
                name="flyerRank"
                type="number"
                min="1"
                max="16"
                value={formData.flyerRank}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.businessCardsRank}
                name="businessCardsRank"
                type="number"
                min="1"
                max="16"
                value={formData.businessCardsRank}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.shirtsHoodiesRank}
                name="shirtsHoodiesRank"
                type="number"
                min="1"
                max="16"
                value={formData.shirtsHoodiesRank}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.pitchDeckRank}
                name="pitchDeckRank"
                type="number"
                min="1"
                max="16"
                value={formData.pitchDeckRank}
                onChange={handleChange}
              />
              <MemoizedInputField
                label={t.bookingToolIntegrationRank}
                name="bookingToolIntegrationRank"
                type="number"
                min="1"
                max="16"
                value={formData.bookingToolIntegrationRank}
                onChange={handleChange}
              />
            </div>
          </div>
        )
      case "additionalInfo":
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6">{t.additionalInfo}</h2>
            <MemoizedInputField
              label={t.companyStage}
            name="companyStage" 
            type="select" 
              options={["Idea", "Founded", "Has Customers"]}
              value={formData.companyStage}
              onChange={handleChange}
            />
            <MemoizedInputField
              label={t.knowsGoToMarketVoucher}
              name="knowsGoToMarketVoucher"
              type="checkbox"
              checked={formData.knowsGoToMarketVoucher}
              onChange={handleChange}
            />
            <MemoizedInputField
              label={t.appliedForGoToMarketVoucher}
              name="appliedForGoToMarketVoucher"
              type="checkbox"
              checked={formData.appliedForGoToMarketVoucher}
              onChange={handleChange}
            />
            <MemoizedInputField
              label={t.moodGraphic}
              name="moodGraphic"
              type="file"
              onChange={handleChange}
              formData={formData}
            />
            <MemoizedInputField
              label={t.additionalDocuments}
              name="additionalDocuments"
              type="file"
              onChange={handleChange}
              formData={formData}
            />
            <MemoizedInputField
              label={t.addInfo}
              name="additionalInfo"
              type="textarea"
              value={formData.additionalInfo}
              onChange={handleChange}
            />
          </div>
        )
      case "review":
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6">{t.review}</h2>
            <p className="mb-6 text-gray-600">Please review your information before submitting.</p>

            {/* Company Information */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium mb-4">{t.companyInfo}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.name && (
                  <div>
                    <p className="font-medium text-gray-700">{t.name}:</p>
                    <p>{formData.name}</p>
                  </div>
                )}
                {formData.industry && (
                  <div>
                    <p className="font-medium text-gray-700">{t.industry}:</p>
                    <p>{formData.industry}</p>
                  </div>
                )}
                {formData.businessType && (
                  <div>
                    <p className="font-medium text-gray-700">{t.businessType}:</p>
                    <p>{formData.businessType}</p>
                  </div>
                )}
                {formData.slogan && (
                  <div>
                    <p className="font-medium text-gray-700">{t.slogan}:</p>
                    <p>{formData.slogan}</p>
                  </div>
                )}
                {formData.customerGroups && (
                  <div>
                    <p className="font-medium text-gray-700">{t.customerGroups}:</p>
                    <p>{formData.customerGroups}</p>
                  </div>
                )}
                {formData.customerDescription && (
                  <div>
                    <p className="font-medium text-gray-700">{t.customerDescription}:</p>
                    <p>{formData.customerDescription}</p>
                  </div>
                )}
                {formData.customerAcquisition && (
                  <div>
                    <p className="font-medium text-gray-700">{t.customerAcquisition}:</p>
                    <p>{formData.customerAcquisition}</p>
                  </div>
                )}
                {formData.linkSource && (
                  <div>
                    <p className="font-medium text-gray-700">{t.linkSource}:</p>
                    <p>{formData.linkSource}</p>
                  </div>
                )}
                {formData.productCount && (
                  <div>
                    <p className="font-medium text-gray-700">{t.productCount}:</p>
                    <p>{formData.productCount}</p>
                  </div>
                )}
                {formData.websiteProductCount && (
                  <div>
                    <p className="font-medium text-gray-700">{t.websiteProductCount}:</p>
                    <p>{formData.websiteProductCount}</p>
                  </div>
                )}
              </div>
              {formData.customerProblem && (
                <div className="mt-4">
                  <p className="font-medium text-gray-700">{t.customerProblem}:</p>
                  <p className="whitespace-pre-wrap">{formData.customerProblem}</p>
                </div>
              )}
              {formData.solution && (
                <div className="mt-4">
                  <p className="font-medium text-gray-700">{t.solution}:</p>
                  <p className="whitespace-pre-wrap">{formData.solution}</p>
                </div>
              )}
              {formData.competitors && (
                <div className="mt-4">
                  <p className="font-medium text-gray-700">{t.competitors}:</p>
                  <p className="whitespace-pre-wrap">{formData.competitors}</p>
                </div>
              )}
              {formData.address && (
                <div className="mt-4">
                  <p className="font-medium text-gray-700">{t.address}:</p>
                  <p className="whitespace-pre-wrap">{formData.address}</p>
                </div>
              )}
            </div>

            {/* Founders */}
            {formData.founders.length > 0 && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium mb-4">{t.founders}</h3>
                {formData.founders.map((founder, index) => (
                  <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                    <h4 className="text-lg font-medium mb-2">
                      {t.founder} {index + 1}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {founder.firstName && founder.lastName && (
                        <div>
                          <p className="font-medium text-gray-700">{t.name}:</p>
                          <p>
                            {founder.firstName} {founder.lastName}
                          </p>
                        </div>
                      )}
                      {founder.title && (
                        <div>
                          <p className="font-medium text-gray-700">{t.title}:</p>
                          <p>{founder.title}</p>
                        </div>
                      )}
                      {founder.position && (
                        <div>
                          <p className="font-medium text-gray-700">{t.position}:</p>
                          <p>{founder.position}</p>
                        </div>
                      )}
                      {founder.gender && (
                        <div>
                          <p className="font-medium text-gray-700">{t.gender}:</p>
                          <p>{founder.gender}</p>
                        </div>
                      )}
                      {founder.mobile && (
                        <div>
                          <p className="font-medium text-gray-700">{t.mobile}:</p>
                          <p>{founder.mobile}</p>
                        </div>
                      )}
                      {founder.landline && (
                        <div>
                          <p className="font-medium text-gray-700">{t.landline}:</p>
                          <p>{founder.landline}</p>
                        </div>
                      )}
                      {founder.email && (
                        <div>
                          <p className="font-medium text-gray-700">{t.email}:</p>
                          <p>{founder.email}</p>
                        </div>
                      )}
                      {founder.calendar && (
                        <div>
                          <p className="font-medium text-gray-700">{t.calendar}:</p>
                          <p>{founder.calendar}</p>
                        </div>
                      )}
                    </div>
                    {founder.image && founder.image.name && (
                      <div className="mt-4">
                        <p className="font-medium text-gray-700">{t.image}:</p>
                        <p>{founder.image.name}</p>
                        {founder.image.type && founder.image.type.startsWith("image/") && (
                          <img
                            src={URL.createObjectURL(founder.image) || "/placeholder.svg"}
                            alt={`${founder.firstName} ${founder.lastName}`}
                            className="mt-2 h-24 object-contain rounded"
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Website Setup */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium mb-4">{t.websiteSetup}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.currentWebsite && (
                  <div>
                    <p className="font-medium text-gray-700">{t.currentWebsite}:</p>
                    <p>{formData.currentWebsite}</p>
                  </div>
                )}
                {formData.addressForm && (
                  <div>
                    <p className="font-medium text-gray-700">{t.addressForm}:</p>
                    <p>{formData.addressForm}</p>
                  </div>
                )}
                {formData.perspective && (
                  <div>
                    <p className="font-medium text-gray-700">{t.perspective}:</p>
                    <p>{formData.perspective}</p>
                  </div>
                )}
                {formData.calendarLink && (
                  <div>
                    <p className="font-medium text-gray-700">{t.calendarLink}:</p>
                    <p>{formData.calendarLink}</p>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-700">{t.hasTestimonials}:</p>
                  <p>{formData.hasTestimonials ? "Yes" : "No"}</p>
                </div>
                {formData.newsletterPopupTimer && (
                  <div>
                    <p className="font-medium text-gray-700">{t.newsletterPopupTimer}:</p>
                    <p>{formData.newsletterPopupTimer}</p>
                  </div>
                )}
              </div>
              {formData.partners && (
                <div className="mt-4">
                  <p className="font-medium text-gray-700">{t.partners}:</p>
                  <p className="whitespace-pre-wrap">{formData.partners}</p>
                </div>
              )}
            </div>

            {/* Testimonials */}
            {(formData.testimonial1Name || formData.testimonial2Name || formData.testimonial3Name) && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium mb-4">{t.testimonials}</h3>

                {formData.testimonial1Name && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h4 className="text-lg font-medium mb-2">Testimonial 1</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-700">{t.name}:</p>
                        <p>{formData.testimonial1Name}</p>
                      </div>
                      {formData.testimonial1Position && (
                        <div>
                          <p className="font-medium text-gray-700">{t.position}:</p>
                          <p>{formData.testimonial1Position}</p>
                        </div>
                      )}
                      {formData.testimonial1Company && (
                        <div>
                          <p className="font-medium text-gray-700">{t.company}:</p>
                          <p>{formData.testimonial1Company}</p>
                        </div>
                      )}
                    </div>
                    {formData.testimonial1Text && (
                      <div className="mt-4">
                        <p className="font-medium text-gray-700">{t.text}:</p>
                        <p className="whitespace-pre-wrap">{formData.testimonial1Text}</p>
                      </div>
                    )}
                    {formData.testimonial1Image && formData.testimonial1Image.name && (
                      <div className="mt-4">
                        <p className="font-medium text-gray-700">{t.image}:</p>
                        <p>{formData.testimonial1Image.name}</p>
                        {formData.testimonial1Image.type && formData.testimonial1Image.type.startsWith("image/") && (
                          <img
                            src={URL.createObjectURL(formData.testimonial1Image) || "/placeholder.svg"}
                            alt="Testimonial 1"
                            className="mt-2 h-24 object-contain rounded"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {formData.testimonial2Name && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h4 className="text-lg font-medium mb-2">Testimonial 2</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-700">{t.name}:</p>
                        <p>{formData.testimonial2Name}</p>
                      </div>
                      {formData.testimonial2Position && (
                        <div>
                          <p className="font-medium text-gray-700">{t.position}:</p>
                          <p>{formData.testimonial2Position}</p>
                        </div>
                      )}
                      {formData.testimonial2Company && (
                        <div>
                          <p className="font-medium text-gray-700">{t.company}:</p>
                          <p>{formData.testimonial2Company}</p>
                        </div>
                      )}
                    </div>
                    {formData.testimonial2Text && (
                      <div className="mt-4">
                        <p className="font-medium text-gray-700">{t.text}:</p>
                        <p className="whitespace-pre-wrap">{formData.testimonial2Text}</p>
                      </div>
                    )}
                    {formData.testimonial2Image && formData.testimonial2Image.name && (
                      <div className="mt-4">
                        <p className="font-medium text-gray-700">{t.image}:</p>
                        <p>{formData.testimonial2Image.name}</p>
                        {formData.testimonial2Image.type && formData.testimonial2Image.type.startsWith("image/") && (
                          <img
                            src={URL.createObjectURL(formData.testimonial2Image) || "/placeholder.svg"}
                            alt="Testimonial 2"
                            className="mt-2 h-24 object-contain rounded"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {formData.testimonial3Name && (
                  <div>
                    <h4 className="text-lg font-medium mb-2">Testimonial 3</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-700">{t.name}:</p>
                        <p>{formData.testimonial3Name}</p>
                      </div>
                      {formData.testimonial3Position && (
                        <div>
                          <p className="font-medium text-gray-700">{t.position}:</p>
                          <p>{formData.testimonial3Position}</p>
                        </div>
                      )}
                      {formData.testimonial3Company && (
                        <div>
                          <p className="font-medium text-gray-700">{t.company}:</p>
                          <p>{formData.testimonial3Company}</p>
                        </div>
                      )}
                    </div>
                    {formData.testimonial3Text && (
                      <div className="mt-4">
                        <p className="font-medium text-gray-700">{t.text}:</p>
                        <p className="whitespace-pre-wrap">{formData.testimonial3Text}</p>
                      </div>
                    )}
                    {formData.testimonial3Image && formData.testimonial3Image.name && (
                      <div className="mt-4">
                        <p className="font-medium text-gray-700">{t.image}:</p>
                        <p>{formData.testimonial3Image.name}</p>
                        {formData.testimonial3Image.type && formData.testimonial3Image.type.startsWith("image/") && (
                          <img
                            src={URL.createObjectURL(formData.testimonial3Image) || "/placeholder.svg"}
                            alt="Testimonial 3"
                            className="mt-2 h-24 object-contain rounded"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* FAQs */}
            {formData.hasFAQs && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium mb-4">{t.faqs}</h3>

                {formData.faq1Question && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h4 className="text-lg font-medium mb-2">FAQ 1</h4>
                    <div>
                      <p className="font-medium text-gray-700">{t.question1}:</p>
                      <p>{formData.faq1Question}</p>
                    </div>
                    {formData.faq1Answer && (
                      <div className="mt-2">
                        <p className="font-medium text-gray-700">{t.answer1}:</p>
                        <p className="whitespace-pre-wrap">{formData.faq1Answer}</p>
                      </div>
                    )}
                  </div>
                )}

                {formData.faq2Question && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h4 className="text-lg font-medium mb-2">FAQ 2</h4>
                    <div>
                      <p className="font-medium text-gray-700">{t.question2}:</p>
                      <p>{formData.faq2Question}</p>
                    </div>
                    {formData.faq2Answer && (
                      <div className="mt-2">
                        <p className="font-medium text-gray-700">{t.answer2}:</p>
                        <p className="whitespace-pre-wrap">{formData.faq2Answer}</p>
                      </div>
                    )}
                  </div>
                )}

                {formData.faq3Question && (
                  <div>
                    <h4 className="text-lg font-medium mb-2">FAQ 3</h4>
                    <div>
                      <p className="font-medium text-gray-700">{t.question3}:</p>
                      <p>{formData.faq3Question}</p>
                    </div>
                    {formData.faq3Answer && (
                      <div className="mt-2">
                        <p className="font-medium text-gray-700">{t.answer3}:</p>
                        <p className="whitespace-pre-wrap">{formData.faq3Answer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Visibility Bundle */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium mb-4">{t.visibilityBundle}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.logoRank && (
                  <div>
                    <p className="font-medium text-gray-700">{t.logoRank}:</p>
                    <p>{formData.logoRank}</p>
                  </div>
                )}
                {formData.websiteRank && (
                  <div>
                    <p className="font-medium text-gray-700">{t.websiteRank}:</p>
                    <p>{formData.websiteRank}</p>
                  </div>
                )}
                {formData.callBackgroundRank && (
                  <div>
                    <p className="font-medium text-gray-700">{t.callBackgroundRank}:</p>
                    <p>{formData.callBackgroundRank}</p>
                  </div>
                )}
                {formData.qrCodeRank && (
                  <div>
                    <p className="font-medium text-gray-700">{t.qrCodeRank}:</p>
                    <p>{formData.qrCodeRank}</p>
                  </div>
                )}
                {formData.socialMediaBannerRank && (
                  <div>
                    <p className="font-medium text-gray-700">{t.socialMediaBannerRank}:</p>
                    <p>{formData.socialMediaBannerRank}</p>
                  </div>
                )}
                {formData.newsletterTemplateRank && (
                  <div>
                    <p className="font-medium text-gray-700">{t.newsletterTemplateRank}:</p>
                    <p>{formData.newsletterTemplateRank}</p>
                  </div>
                )}
                {formData.emailSignaturesRank && (
                  <div>
                    <p className="font-medium text-gray-700">{t.emailSignaturesRank}:</p>
                    <p>{formData.emailSignaturesRank}</p>
                  </div>
                )}
                {formData.letterTemplateRank && (
                  <div>
                    <p className="font-medium text-gray-700">{t.letterTemplateRank}:</p>
                    <p>{formData.letterTemplateRank}</p>
                  </div>
                )}
                {formData.smartphoneScreenBackgroundRank && (
                  <div>
                    <p className="font-medium text-gray-700">{t.smartphoneScreenBackgroundRank}:</p>
                    <p>{formData.smartphoneScreenBackgroundRank}</p>
                  </div>
                )}
                {formData.desktopScreenBackgroundRank && (
                  <div>
                    <p className="font-medium text-gray-700">{t.desktopScreenBackgroundRank}:</p>
                    <p>{formData.desktopScreenBackgroundRank}</p>
                  </div>
                )}
                {formData.rollUpRank && (
                  <div>
                    <p className="font-medium text-gray-700">{t.rollUpRank}:</p>
                    <p>{formData.rollUpRank}</p>
                  </div>
                )}
                {formData.flyerRank && (
                  <div>
                    <p className="font-medium text-gray-700">{t.flyerRank}:</p>
                    <p>{formData.flyerRank}</p>
                  </div>
                )}
                {formData.businessCardsRank && (
                  <div>
                    <p className="font-medium text-gray-700">{t.businessCardsRank}:</p>
                    <p>{formData.businessCardsRank}</p>
                  </div>
                )}
                {formData.shirtsHoodiesRank && (
                  <div>
                    <p className="font-medium text-gray-700">{t.shirtsHoodiesRank}:</p>
                    <p>{formData.shirtsHoodiesRank}</p>
                  </div>
                )}
                {formData.pitchDeckRank && (
                  <div>
                    <p className="font-medium text-gray-700">{t.pitchDeckRank}:</p>
                    <p>{formData.pitchDeckRank}</p>
                  </div>
                )}
                {formData.bookingToolIntegrationRank && (
                  <div>
                    <p className="font-medium text-gray-700">{t.bookingToolIntegrationRank}:</p>
                    <p>{formData.bookingToolIntegrationRank}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium mb-4">{t.additionalInfo}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.companyStage && (
                  <div>
                    <p className="font-medium text-gray-700">{t.companyStage}:</p>
                    <p>{formData.companyStage}</p>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-700">{t.knowsGoToMarketVoucher}:</p>
                  <p>{formData.knowsGoToMarketVoucher ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">{t.appliedForGoToMarketVoucher}:</p>
                  <p>{formData.appliedForGoToMarketVoucher ? "Yes" : "No"}</p>
                </div>
              </div>

              {formData.moodGraphic && formData.moodGraphic.name && (
                <div className="mt-4">
                  <p className="font-medium text-gray-700">{t.moodGraphic}:</p>
                  <p>{formData.moodGraphic.name}</p>
                  {formData.moodGraphic.type && formData.moodGraphic.type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(formData.moodGraphic) || "/placeholder.svg"}
                      alt="Mood Graphic"
                      className="mt-2 h-24 object-contain rounded"
                    />
                  )}
                </div>
              )}

              {formData.additionalDocuments && formData.additionalDocuments.name && (
                <div className="mt-4">
                  <p className="font-medium text-gray-700">{t.additionalDocuments}:</p>
                  <p>{formData.additionalDocuments.name}</p>
                </div>
              )}

              {formData.additionalInfo && (
                <div className="mt-4">
                  <p className="font-medium text-gray-700">{t.addInfo}:</p>
                  <p className="whitespace-pre-wrap">{formData.additionalInfo}</p>
                </div>
              )}
            </div>

            {/* Final submit button */}
            <div className="mt-8">
          <button 
            type="submit" 
                className={`w-full py-4 px-6 text-lg font-medium rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={loading}
          >
                {loading
                  ? uploadingFiles
                    ? currentLanguage === "en"
                      ? "Uploading files..."
                      : "Dateien werden hochgeladen..."
                    : t.submitting
                  : t.submit}
          </button>
        </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header with language toggle */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">{t.title}</h1>
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-gray-800"
          >
            {t.switchLanguage}
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-gray-200 z-10">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
        ></div>
      </div>

      {/* Progress indicator */}
      <div className="fixed top-20 left-0 right-0 bg-white border-b border-gray-200 py-2 z-10">
        <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {t.step} {currentSection + 1} {t.progressOf} {sections.length}
          </div>
          <div className="text-sm font-medium text-blue-600">{sections[currentSection].title}</div>
        </div>
      </div>

      {/* Main content */}
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4">
          {/* Notifications */}
          {error && <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">{t.success}</div>
          )}

          {uploadingFiles && (
            <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
              {t.uploadingFiles}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} ref={formRef} className="bg-white rounded-xl shadow-xl p-8">
            {renderSection()}
      </form>
    </div>
      </main>

      {/* Navigation buttons */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-4 z-10">
        <div className="max-w-3xl mx-auto flex justify-between">
          <button
            type="button"
            onClick={goToPreviousSection}
            disabled={currentSection === 0}
            className={`px-6 py-3 rounded-lg font-medium ${
              currentSection === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {t.previous}
          </button>

          {currentSection < sections.length - 1 ? (
            <button
              type="button"
              onClick={goToNextSection}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              {t.next}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium ${
                loading ? "bg-gray-400 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading ? t.submitting : t.submit}
            </button>
          )}
        </div>
      </footer>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default VisibilityFormulaForm

