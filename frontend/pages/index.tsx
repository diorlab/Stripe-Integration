import { useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Loader2 } from 'lucide-react'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://160.187.141.62:4000'

interface Plan {
    id: string
    name: string
    price: number
    description: string
    features: string[]
    highlighted?: boolean
}

const plans: Plan[] = [
    {
        id: 'basic',
        name: 'Basic',
        price: 9,
        description: 'For individuals and small projects',
        features: [
            '5 projects',
            '10GB storage',
            'Email support',
            'Basic analytics',
        ],
    },
    {
        id: 'pro',
        name: 'Professional',
        price: 29,
        description: 'For growing teams',
        features: [
            'Unlimited projects',
            '100GB storage',
            'Priority support',
            'Advanced analytics',
            'Team collaboration',
            'API access',
        ],
        highlighted: true,
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99,
        description: 'For large organizations',
        features: [
            'Everything in Pro',
            'Unlimited storage',
            '24/7 phone support',
            'Custom integrations',
            'SLA guarantee',
            'Dedicated manager',
        ],
    },
]

export default function Pricing() {
    const [loading, setLoading] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handlePurchase = async (plan: Plan) => {
        setLoading(plan.id)
        setError(null)

        try {
            const amountCents = plan.price * 100

            const response = await axios.post(`${BACKEND_URL}/api/create-checkout-session`, {
                amountCents,
                currency: 'usd',
                successUrl: `${window.location.origin}/success`,
                cancelUrl: `${window.location.origin}/cancel`,
            })

            const { url } = response.data

            if (url) {
                window.location.href = url
            } else {
                throw new Error('No checkout URL returned')
            }
        } catch (err: any) {
            console.error('Checkout error:', err)
            setError(err.response?.data?.error || 'Failed to create checkout session')
            setLoading(null)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Choose Your Plan
                    </h1>
                    <p className="text-lg text-gray-600">
                        Select the plan that works best for you
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <Card
                            key={plan.id}
                            className={`relative ${plan.highlighted
                                ? 'border-2 border-blue-500 shadow-lg'
                                : 'border border-gray-200'
                                }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <CardHeader className="text-center pb-8">
                                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                                <div className="mb-4">
                                    <span className="text-4xl font-bold">${plan.price}</span>
                                    <span className="text-gray-600">/month</span>
                                </div>
                                <p className="text-gray-600 text-sm">{plan.description}</p>
                            </CardHeader>

                            <CardContent>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    onClick={() => handlePurchase(plan)}
                                    disabled={loading !== null}
                                    className={`w-full h-11 ${plan.highlighted
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : 'bg-gray-900 hover:bg-gray-800'
                                        }`}
                                >
                                    {loading === plan.id ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Get Started'
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-8 text-sm text-gray-600 border-t border-gray-200 pt-8">
                        <div>
                            <strong className="text-gray-900">SSL Secure</strong> payments
                        </div>
                        <div>
                            <strong className="text-gray-900">Cancel</strong> anytime
                        </div>
                        <div>
                            <strong className="text-gray-900">24/7</strong> support
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
