import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Home } from 'lucide-react'

export default function Success() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            Your payment has been processed successfully. You should receive a confirmation email shortly.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
            <p className="font-medium mb-2">What's next?</p>
            <ul className="text-left space-y-1">
              <li>• Check your email for the receipt</li>
              <li>• Access your account dashboard</li>
              <li>• Start using your new plan</li>
            </ul>
          </div>

          <Link href="/" className="block">
            <Button className="w-full bg-gray-900 hover:bg-gray-800">
              <Home className="mr-2 h-4 w-4" />
              Back to Plans
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
