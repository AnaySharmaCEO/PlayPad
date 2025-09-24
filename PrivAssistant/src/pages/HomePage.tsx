import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { 
  ArrowRight, Check, Star, ChevronLeft, ChevronRight,
  Mail, Github, Twitter, Linkedin, Globe, Accessibility,
  MessageSquare, Calendar, Crown, Mic, Zap, Shield, Clock, Users
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { type NavigationMode } from '../components/Navigation';

interface HomePageProps {
  onNavigate: (mode: NavigationMode) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [email, setEmail] = useState('');

  const whyChooseUs = [
    {
      icon: Accessibility,
      title: 'Built for Accessibility',
      description: 'Live captions and speech tools ensure everyone can participate.',
    },
    {
      icon: MessageSquare,
      title: 'Live Captions and Speech Tools',
      description: 'Real-time transcription and text-to-speech capabilities.',
    },
    {
      icon: Clock,
      title: 'Minimal, Distraction-Free UI',
      description: 'Clean interface that lets you focus on what matters.',
    },
    {
      icon: Users,
      title: 'Built by Devs, for Real Users',
      description: 'Designed with real-world workflows and accessibility in mind.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        'Basic voice and text chat',
        'Simple scheduling',
        'Chess gameplay',
        'Live captions',
        'Community support',
      ],
      popular: false,
      buttonText: 'Get Started',
    },
    {
      name: 'Premium',
      price: '$9',
      period: '/month',
      description: 'For power users and professionals',
      features: [
        'Advanced AI conversations',
        'Smart scheduling with exports',
        'Chess analysis & hints',
        'Priority support',
        'Custom themes',
        'Advanced captions',
      ],
      popular: true,
      buttonText: 'Choose Premium',
    },
    {
      name: 'Ultra',
      price: '$19',
      period: '/month',
      description: 'Everything you need and more',
      features: [
        'Everything in Premium',
        'API access',
        'Custom integrations',
        'Advanced chess training',
        'White-label options',
        'Dedicated support',
      ],
      popular: false,
      buttonText: 'Choose Ultra',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager',
      image: 'https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMGF2YXRhcnxlbnwxfHx8fDE3NTgzNTg2Njd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      quote: 'The accessibility features are outstanding. Live captions have made AI interactions truly inclusive for our team.',
      rating: 5,
    },
    {
      name: 'Alex Rodriguez',
      role: 'Student',
      image: 'https://images.unsplash.com/photo-1604177091072-b7b677a077f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIweW91bmclMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU4Mzc1NTMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      quote: 'Perfect for managing my study schedule and the chess feature helps me relax between study sessions.',
      rating: 5,
    },
    {
      name: 'Emily Watson',
      role: 'Developer',
      image: 'https://images.unsplash.com/photo-1732210038531-9cefab37885a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXZlbG9wZXIlMjBwcm9ncmFtbWVyJTIwd29tYW58ZW58MXx8fHwxNzU4Mzc1NTMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      quote: 'The API access in the Ultra plan is fantastic. We\'ve integrated it seamlessly into our workflow.',
      rating: 5,
    },
    {
      name: 'Michael Park',
      role: 'Chess Enthusiast',
      image: 'https://images.unsplash.com/photo-1628017974725-18928e8e8211?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwc3RhcnR1cCUyMG9mZmljZXxlbnwxfHx8fDE3NTgzNjk5MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      quote: 'The chess analysis features are professional-grade. It\'s like having a grandmaster as your coach.',
      rating: 5,
    },
  ];

  const brands = [
    'TechCorp', 'InnovateCo', 'FutureScale', 'DigitalPro', 'NextGen', 'SmartFlow'
  ];

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock newsletter signup
    alert(`Thanks for subscribing with ${email}!`);
    setEmail('');
  };

  // Animation components
  const FadeInWhenVisible = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col items-center justify-center mb-8">
              <h1 className="text-5xl sm:text-7xl font-bold text-foreground mb-6">
                Your All-in-One AI Agent
              </h1>
            </div>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              Talk, Work, and Play — in one clean workspace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => onNavigate('playpad')}
                size="lg"
                className="border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300 text-foreground bg-transparent px-8 py-4"
              >
                Enter PlayPad
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-muted-foreground hover:bg-muted hover:text-foreground px-8 py-4"
                onClick={() => scrollToSection('features')}
              >
                See Features
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

    {/* Features Section */}
      <section id="features" className="py-20 bg-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Features</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Communication, work, and game tools in one unified platform
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeInWhenVisible>
              <Card className="border border-border hover:border-foreground transition-all duration-300 bg-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="border-2 border-foreground p-3 rounded-lg mr-4">
                      <MessageSquare className="h-6 w-6 text-foreground" />
                    </div>
                    Communication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Voice and text chat with live captions and accessibility features.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-1 h-1 bg-foreground rounded-full mr-3"></div>
                      Voice Mode with real-time transcription
                    </li>
                    <li className="flex items-center">
                      <div className="w-1 h-1 bg-foreground rounded-full mr-3"></div>
                      Text Mode with markdown support
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible>
              <Card className="border border-border hover:border-foreground transition-all duration-300 bg-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="border-2 border-foreground p-3 rounded-lg mr-4">
                      <Calendar className="h-6 w-6 text-foreground" />
                    </div>
                    Work
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Smart scheduling with AI-powered task generation and export capabilities.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-1 h-1 bg-foreground rounded-full mr-3"></div>
                      Weekly calendar with drag & drop
                    </li>
                    <li className="flex items-center">
                      <div className="w-1 h-1 bg-foreground rounded-full mr-3"></div>
                      CSV/ICS export functionality
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible>
              <Card className="border border-border hover:border-foreground transition-all duration-300 bg-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="border-2 border-foreground p-3 rounded-lg mr-4">
                      <Crown className="h-6 w-6 text-foreground" />
                    </div>
                    Game
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Professional chess with AI analysis and multiple game modes.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-1 h-1 bg-foreground rounded-full mr-3"></div>
                      AI vs Player with difficulty levels
                    </li>
                    <li className="flex items-center">
                      <div className="w-1 h-1 bg-foreground rounded-full mr-3"></div>
                      Move analysis and hints
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible>
              <Card className="border border-border hover:border-foreground transition-all duration-300 bg-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="border-2 border-foreground p-3 rounded-lg mr-4">
                      <Accessibility className="h-6 w-6 text-foreground" />
                    </div>
                    Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Built with accessibility at the core for inclusive user experiences.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-1 h-1 bg-foreground rounded-full mr-3"></div>
                      WCAG AA+ compliant
                    </li>
                    <li className="flex items-center">
                      <div className="w-1 h-1 bg-foreground rounded-full mr-3"></div>
                      Keyboard navigation support
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Choose PlayPad AI?</h2>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <FadeInWhenVisible key={index}>
                  <div className="text-center p-6 border border-border hover:border-foreground transition-all duration-300">
                    <div className="border-2 border-foreground p-4 rounded-lg mx-auto mb-6 w-fit">
                      <Icon className="h-8 w-8 text-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </FadeInWhenVisible>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <FadeInWhenVisible key={index}>
                <Card className={`border-2 transition-all duration-500 h-full ${
                  plan.popular 
                    ? 'border-foreground bg-foreground text-background' 
                    : 'border-border hover:border-foreground bg-card'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-background text-foreground border border-foreground px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8 pt-8">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className={plan.popular ? "text-background/70" : "text-muted-foreground"}>{plan.period}</span>
                    </div>
                    <p className={plan.popular ? "text-background/70" : "text-muted-foreground"}>{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className={`h-5 w-5 mr-3 flex-shrink-0 ${plan.popular ? 'text-background' : 'text-foreground'}`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full py-6 ${
                        plan.popular
                          ? 'bg-background text-foreground hover:bg-background/90 border-0'
                          : 'border-2 border-foreground hover:bg-foreground hover:text-background'
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            </div>
          </FadeInWhenVisible>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                <Card className="border border-border bg-card p-8 text-center">
                  <CardContent className="space-y-6">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 text-foreground fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-2xl italic text-muted-foreground leading-relaxed">
                      "{testimonials[currentTestimonial].quote}"
                    </blockquote>
                    <div className="flex items-center justify-center space-x-4">
                      <Avatar className="h-16 w-16 border-2 border-border">
                        <AvatarImage src={testimonials[currentTestimonial].image} alt={testimonials[currentTestimonial].name} />
                        <AvatarFallback>{testimonials[currentTestimonial].name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-lg">{testimonials[currentTestimonial].name}</p>
                        <p className="text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 border-border hover:border-foreground"
              onClick={prevTestimonial}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 border-border hover:border-foreground"
              onClick={nextTestimonial}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 border border-border transition-all duration-300 ${
                  index === currentTestimonial 
                    ? 'bg-foreground' 
                    : 'bg-background hover:bg-muted'
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section id="brands" className="py-20 bg-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Trusted By</h2>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
              {brands.map((brand, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="text-center opacity-60 hover:opacity-100 transition-all duration-300"
                >
                  <div className="text-foreground font-bold text-xl">
                    {brand}
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <FadeInWhenVisible>
            <Card className="border border-border bg-card p-8 text-center">
              <CardContent className="space-y-6">
                <h2 className="text-3xl font-bold">Stay in the Loop</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Register for updates and be the first to know about new features
                </p>
                <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 border-border"
                  />
                  <Button 
                    type="submit"
                    className="bg-foreground text-background hover:bg-foreground/90 border-0"
                  >
                    Subscribe
                  </Button>
                </form>
              </CardContent>
            </Card>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-secondary border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="border-2 border-foreground p-2 rounded-lg">
                  <div className="h-6 w-6 bg-foreground"></div>
                </div>
                <span className="font-bold text-xl text-foreground">
                  PlayPad AI
                </span>
              </div>
              <p className="text-muted-foreground">
                Your all-in-one AI assistant for smarter conversations, scheduling, and play.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><button onClick={() => scrollToSection('hero')} className="hover:text-foreground transition-colors">Home</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-foreground transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-foreground transition-colors">Pricing</button></li>
                <li><button className="hover:text-foreground transition-colors">About</button></li>
                <li><button className="hover:text-foreground transition-colors">Contact</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><button className="hover:text-foreground transition-colors">Communication</button></li>
                <li><button className="hover:text-foreground transition-colors">Work</button></li>
                <li><button className="hover:text-foreground transition-colors">Game</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="border border-border hover:border-foreground">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="border border-border hover:border-foreground">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="border border-border hover:border-foreground">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="border border-border hover:border-foreground">
                  <Globe className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>© 2025 Intelligent Agent Project Team. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};