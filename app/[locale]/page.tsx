"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Scale, Sparkles, BookOpen, Building2, Moon, Sun } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <header className="flex h-14 items-center border-b px-4 lg:px-6">
        <Link className="flex items-center justify-center" href="/">
          <Scale className="size-6" />
          <span className="sr-only">AI Legal Assistant</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  AI-Powered Legal Assistant for Latvian Law
                </h1>
                <p className="text-muted-foreground mx-auto max-w-[700px] md:text-xl">
                  Streamline your legal research and decision-making with our
                  advanced AI chatbot, tailored for Latvian legal professionals
                  and corporate entities.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit">Get Started</Button>
                </form>
                <p className="text-muted-foreground text-xs">
                  Start your free trial. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          className="bg-muted w-full py-12 md:py-24 lg:py-32"
          id="features"
        >
          <div className="container px-4 md:px-6">
            <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <FeatureCard
                icon={<Sparkles className="mb-2 size-10" />}
                title="AI-Powered Insights"
                description="Leverage advanced AI to quickly analyze complex legal scenarios and provide accurate insights."
              />
              <FeatureCard
                icon={<BookOpen className="mb-2 size-10" />}
                title="Comprehensive Database"
                description="Access a vast repository of Latvian laws, regulations, and case precedents at your fingertips."
              />
              <FeatureCard
                icon={<Building2 className="mb-2 size-10" />}
                title="Corporate Compliance"
                description="Stay up-to-date with the latest corporate laws and ensure your business remains compliant."
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32" id="testimonials">
          <div className="container px-4 md:px-6">
            <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              What Our Clients Say
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <TestimonialCard
                quote="This AI tool has revolutionized our legal research process. It's like having a brilliant legal assistant available 24/7."
                author="Jānis Bērziņš, Senior Partner at LawFirm LLP"
              />
              <TestimonialCard
                quote="As a corporate legal team, we've seen a significant boost in our efficiency since adopting this AI chatbot."
                author="Linda Ozola, Legal Counsel at TechCorp Latvia"
              />
              <TestimonialCard
                quote="The accuracy and speed of this tool in navigating Latvian law is impressive. It's become an indispensable part of our practice."
                author="Andris Kalnins, Managing Partner at Kalnins & Associates"
              />
            </div>
          </div>
        </section>
        <section
          className="bg-muted w-full py-12 md:py-24 lg:py-32"
          id="pricing"
        >
          <div className="container px-4 md:px-6">
            <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Pricing Plans
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <PricingCard
                title="Free"
                price="€0/mo"
                features={[
                  "Basic access to AI chatbot",
                  "Limited legal database",
                  "Community support"
                ]}
                buttonText="Get Started"
              />
              <PricingCard
                title="Pro"
                price="Coming Soon"
                features={[
                  "Advanced AI features",
                  "Full legal database access",
                  "Priority support"
                ]}
                buttonText="Join Waitlist"
                disabled
              />
              <PricingCard
                title="Enterprise"
                price="Coming Soon"
                features={[
                  "Customized AI solutions",
                  "Dedicated account manager",
                  "Tailored legal database"
                ]}
                buttonText="Contact Sales"
                disabled
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-muted-foreground text-xs">
          © 2024 AI Legal Assistant. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6" />
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
      {icon}
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground text-center text-sm">{description}</p>
    </div>
  )
}

interface TestimonialCardProps {
  quote: string
  author: string
}

function TestimonialCard({ quote, author }: TestimonialCardProps) {
  return (
    <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
      <p className="text-muted-foreground text-sm italic">{quote}</p>
      <p className="text-sm font-bold">{author}</p>
    </div>
  )
}

interface PricingCardProps {
  title: string
  price: string
  features: string[]
  buttonText: string
  disabled?: boolean
}

function PricingCard({
  title,
  price,
  features,
  buttonText,
  disabled = false
}: PricingCardProps) {
  return (
    <div className="bg-background flex flex-col items-center space-y-2 rounded-lg border p-4">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-4xl font-bold">{price}</p>
      <ul className="text-muted-foreground space-y-2 text-sm">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <Button disabled={disabled}>{buttonText}</Button>
    </div>
  )
}
