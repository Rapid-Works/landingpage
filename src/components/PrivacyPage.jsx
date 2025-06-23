import React, { useContext } from 'react'
import RapidWorksHeader from './new_landing_page_header'
import { LanguageContext } from '../App'

const PrivacyPage = () => {
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
              {translate('privacy.title')}
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose prose-lg max-w-none">
            <div className="space-y-8 text-gray-800">
              
              <section>
                <h2 className="text-2xl font-bold text-[#1D0D37] mb-4">
                  {translate('privacy.sections.section1.title')}
                </h2>
                <p className="leading-relaxed">
                  {translate('privacy.sections.section1.content')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1D0D37] mb-4">
                  {translate('privacy.sections.section2.title')}
                </h2>
                <p className="leading-relaxed whitespace-pre-line">
                  {translate('privacy.sections.section2.content')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1D0D37] mb-4">
                  {translate('privacy.sections.section3.title')}
                </h2>
                <p className="leading-relaxed whitespace-pre-line">
                  {translate('privacy.sections.section3.content')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1D0D37] mb-4">
                  {translate('privacy.sections.section4.title')}
                </h2>
                <p className="leading-relaxed whitespace-pre-line">
                  {translate('privacy.sections.section4.content')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1D0D37] mb-4">
                  {translate('privacy.sections.section5.title')}
                </h2>
                <p className="leading-relaxed">
                  {translate('privacy.sections.section5.content')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1D0D37] mb-4">
                  {translate('privacy.sections.section6.title')}
                </h2>
                <p className="leading-relaxed">
                  {translate('privacy.sections.section6.content')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1D0D37] mb-4">
                  {translate('privacy.sections.section7.title')}  
                </h2>
                <p className="leading-relaxed whitespace-pre-line">
                  {translate('privacy.sections.section7.content')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1D0D37] mb-4">
                  {translate('privacy.sections.section8.title')}
                </h2>
                <p className="leading-relaxed">
                  {translate('privacy.sections.section8.content')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1D0D37] mb-4">
                  {translate('privacy.sections.section9.title')}
                </h2>
                <p className="leading-relaxed">
                  {translate('privacy.sections.section9.content')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1D0D37] mb-4">
                  {translate('privacy.sections.section10.title')}
                </h2>
                <p className="leading-relaxed whitespace-pre-line">
                  {translate('privacy.sections.section10.content')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1D0D37] mb-4">
                  {translate('privacy.sections.section11.title')}
                </h2>
                <p className="leading-relaxed whitespace-pre-line">
                  {translate('privacy.sections.section11.content')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1D0D37] mb-4">
                  {translate('privacy.sections.section12.title')}
                </h2>
                <p className="leading-relaxed">
                  {translate('privacy.sections.section12.content')}
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage 