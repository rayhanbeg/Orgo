import { Leaf, Globe, Shield } from 'lucide-react'

function BenefitsSection() {
  const benefits = [
    {
      id: 1,
      icon: Leaf,
      title: '100% Organic',
      description: 'Sourced directly from certified organic farms with absolutely zero pesticides or artificial additives.'
    },
    {
      id: 2,
      icon: Globe,
      title: 'Ethically Sourced',
      description: 'Committed to fair trade practices, ensuring our farming partners are paid and treated well.'
    },
    {
      id: 3,
      icon: Shield,
      title: 'Premium Quality',
      description: 'Every batch undergoes rigorous quality testing to guarantee the highest nutritional value.'
    }
  ]

  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-[#FDFBF7]">
      <div className="container-fluid">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {benefits.map((benefit) => {
            const IconComponent = benefit.icon
            return (
              <div
                key={benefit.id}
                className="text-center"
              >
                <div className="mb-4 flex justify-center">
                  <IconComponent 
                    size={48} 
                    style={{ color: '#5a8c6f' }}
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="mb-3 text-lg font-semibold" style={{ color: '#1a1a1a' }}>
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7a7a7a' }}>
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection
