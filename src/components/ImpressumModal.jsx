import React from 'react'
import { X } from 'lucide-react'
import { useContext } from 'react'
import { LanguageContext } from '../App'

const ImpressumModal = ({ onClose }) => {
  const { translate } = useContext(LanguageContext)

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
          <section className="w-full">
            <h2 className="text-3xl font-bold mb-8">{translate("impressum.title")}</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">{translate("impressum.companyInfo.title")}</h3>
                <p>{translate("impressum.companyInfo.name")}</p>
                <p>{translate("impressum.companyInfo.street")}</p>
                <p>{translate("impressum.companyInfo.city")}</p>
                <p>{translate("impressum.companyInfo.country")}</p>
                <p>Email: {translate("impressum.companyInfo.email")}</p>
                <p>Tel: {translate("impressum.companyInfo.phone")}</p>
                <p>{translate("impressum.companyInfo.managing")}: {translate("impressum.companyInfo.managingName")}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">{translate("impressum.registration.title")}</h3>
                <p>{translate("impressum.registration.court")}</p>
                <p>{translate("impressum.registration.number")}</p>
                <p>{translate("impressum.registration.vatId")}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">{translate("impressum.responsibility.title")}</h3>
                <p>{translate("impressum.responsibility.name")}</p>
                <p>{translate("impressum.responsibility.address")}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ImpressumModal 