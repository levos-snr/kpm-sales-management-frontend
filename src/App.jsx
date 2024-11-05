import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

function App() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Starter Kit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Shadcn Button</h2>
            <Button>Click me</Button>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Ping Animation</h2>
            <div className="flex items-center space-x-2">
              <div className="relative inline-flex rounded-full h-6 w-6 bg-sky-500 ring-2 ring-sky-400 ring-offset-2 ring-offset-white animate-ping"></div>
              <div className="relative inline-flex rounded-full h-5 w-5 bg-sky-500"></div>
              <span className="text-gray-500">Ping</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
