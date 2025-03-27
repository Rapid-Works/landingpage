import React from 'react';
import { Calendar, Clock, Shield, AlertCircle, FileText, Check } from 'lucide-react';
import RapidWorksHeader from './new_landing_page_header';
import EmailWaitlistForm from './EmailWaitlistForm';

const BlueprintPage = () => {
  const handleSubmit = (email) => {
    console.log('Email submitted:', email);
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-200 selection:text-indigo-900">
      {/* Noise overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-30 pointer-events-none z-0"></div>

      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-indigo-200 rounded-full filter blur-3xl opacity-20 -z-10 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-blue-200 rounded-full filter blur-3xl opacity-20 -z-10 transform -translate-x-1/3 translate-y-1/3"></div>

      {/* Import shared header component */}
      <RapidWorksHeader />

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Left Column - Content */}
            <div className="lg:w-1/2">
              <div className="inline-flex items-center justify-center mb-5 px-4 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 font-medium text-xs shadow-sm">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Coming Soon
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                Rapid <span className="relative inline-block">
                  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">Blueprint</span>
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-indigo-200 rounded-lg -z-10 opacity-70"></span>
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Own your processes in 1 week. You don't need dozens of tools! Our Blueprint service is designed to streamline your business operations and create efficient workflows.
              </p>
              
              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-1 rounded-full mt-1">
                    <Check className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Streamlined Processes</h3>
                    <p className="text-gray-600">Optimize your business operations with custom-designed workflows</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-1 rounded-full mt-1">
                    <Check className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Tool Consolidation</h3>
                    <p className="text-gray-600">Reduce tool sprawl and integrate only what you need</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-1 rounded-full mt-1">
                    <Check className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Documentation & Training</h3>
                    <p className="text-gray-600">Comprehensive documentation and team training included</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-2 rounded-xl">
                    <Calendar className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Launch Date</h3>
                    <p className="text-gray-600">We're launching Rapid Blueprint in Q2 2025. Be the first to know!</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Email Form */}
            <div className="lg:w-1/2">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100 rounded-full translate-y-1/2 -translate-x-1/2 -z-10"></div>
                
                <div className="relative z-10">
                  <div className="bg-indigo-600 text-white p-4 rounded-2xl mb-8 flex items-start gap-4">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Get Early Access</h3>
                      <p className="text-white/80">Join our waitlist and be among the first to experience Rapid Blueprint.</p>
                    </div>
                  </div>
                  
                  <EmailWaitlistForm 
                    buttonText="Notify Me When It Launches"
                    successText="Thank You!"
                    successDescription="You're on the list! We'll notify you when Rapid Blueprint launches."
                    checkboxText="I agree to receive updates about Rapid Blueprint"
                    primaryColor="indigo"
                    onSubmit={handleSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlueprintPage;
