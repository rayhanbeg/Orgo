function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Health Enthusiast',
      image: '👩',
      rating: 5,
      text: 'The quality of products is exceptional. I can taste the difference in every bite. Highly recommend for anyone serious about organic living!'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Busy Parent',
      image: '👨',
      rating: 5,
      text: 'Fast delivery, fresh produce, and great prices. This has become my go-to for weekly groceries. The convenience is unbeatable.'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Chef',
      image: '👩‍🍳',
      rating: 5,
      text: 'As a professional chef, I appreciate quality ingredients. The organic products here meet my high standards perfectly.'
    }
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: 'var(--color-card-bg)' }}>
      <div className="container-fluid">
        <div className="mb-12 text-center">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Customer love
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: 'var(--color-text)' }}>
            Loved by Our Community
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-2xl p-8 transition-transform duration-300 hover:shadow-lg"
              style={{ 
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="text-4xl">{testimonial.image}</div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    {testimonial.name}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} style={{ color: 'var(--color-primary)' }}>★</span>
                ))}
              </div>

              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {testimonial.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
