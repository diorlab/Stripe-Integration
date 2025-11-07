import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ArrowLeft } from 'lucide-react'

export default function Cancel() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10 text-gray-600" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            Your payment was cancelled. No charges were made to your account.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 text-left">
            <p>You can try again whenever you're ready. If you experienced any issues, please contact our support team.</p>
          </div>

          <Link href="/" className="block">
            <Button className="w-full bg-gray-900 hover:bg-gray-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Plans
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
