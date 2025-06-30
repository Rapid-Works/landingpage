import React, { useContext } from 'react'
import RapidWorksHeader from './new_landing_page_header'
import { LanguageContext } from '../App'

const ImpressumPage = () => {
  const { translate } = useContext(LanguageContext)

  return (
    <div className="min-h-screen bg-white">
      <RapidWorksHeader />
      
      {/* Main Content */}
      <div className="pt-16">
        {/* Header Section with brand colors */}
        <div className="bg-gradient-to-r from-[#1D0D37] to-[#7C3BEC] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white">
              {translate('impressum.title')}
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose prose-lg max-w-none">
            <div className="space-y-8 text-gray-800">
              
              <section>
                <h2 className="text-2xl font-bold text-[#1D0D37] mb-4">
                  {translate('impressum.accordingTo')}
                </h2>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1D0D37] mb-4">
                  {translate('impressum.companyInfo.title')}
                </h2>
                <p className="leading-relaxed whitespace-pre-line">
                  {translate('impressum.companyInfo.name')}<br />
                  {translate('impressum.companyInfo.street')}<br />
                  {translate('impressum.companyInfo.city')}<br />
                  {translate('impressum.companyInfo.country')}<br />
                  {translate('impressum.companyInfo.email')}<br />
                  {translate('impressum.companyInfo.phone')}<br />
                  {translate('impressum.companyInfo.managing')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1D0D37] mb-4">
                  {translate('impressum.registration.title')}
                </h2>
                <p className="leading-relaxed whitespace-pre-line">
                  {translate('impressum.registration.court')}<br />
                  {translate('impressum.registration.number')}<br />
                  {translate('impressum.registration.vatId')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1D0D37] mb-4">
                  {translate('impressum.responsibility.title')}
                </h2>
                <p className="leading-relaxed whitespace-pre-line">
                  {translate('impressum.responsibility.name')}<br />
                  {translate('impressum.responsibility.street')}<br />
                  {translate('impressum.responsibility.city')}
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImpressumPage 