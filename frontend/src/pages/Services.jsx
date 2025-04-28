import React from 'react'
import WaxingPackages from '../components/WaxingPackages';
import WaxingServices from '../components/WaxingServices';
 

function Services() {
  return (
    <section className="py-16 px-14 ">
      <div className="max-w-4xl mx-auto space-y-12">
        {WaxingServices.map((section) => (
          <div key={section.category}>
            <h2 className="text-rose-300 text-4xl font-bold mb-5">{section.category}</h2>
            <p className="mb-6">{section.description}</p>
            <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-10 ">
              {section.items.map((item) => (
                <li key={item.name} className="flex justify-between items-start py-3 border-b">
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm">{item.desc} 分鐘</p>
                  </div>
                  <span className="text-lg font-bold">{item.price}</span>
                </li>
              ))}
            </ul>
            
          </div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto space-y-12 py-12">
        {WaxingPackages.map((section) => (
          <div key={section.category}>
            <h2 className="text-rose-400 text-4xl font-bold mb-5">{section.category}</h2>
            <p className="mb-6">{section.description}</p>
            <ul>
              {section.items.map((item) => (
                <li key={item.name} className="flex justify-between gap-16 items-start py-3 border-b">
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm">{item.desc} 分鐘</p>
                  </div>
                  <span className="text-lg font-bold">{item.price}</span>
                </li>
              ))}
            </ul>
            
          </div>
        ))}
      </div>
      
    </section>
  );
}

export default Services;