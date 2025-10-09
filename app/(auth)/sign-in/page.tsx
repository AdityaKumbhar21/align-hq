"use client"

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSignIn } from '@clerk/nextjs'
import { set } from 'mongoose'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

const page = () => {
  const {setActive, isLoaded, signIn} = useSignIn()
  const [emailAddress, setEmailAddress] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  if(!isLoaded) return null

  const handleSubmit = async (e: React.FormEvent) =>{
    e.preventDefault()
    if(!isLoaded) return
    setLoading(true)
    try {
      const complete_signIn = await signIn.create({
        identifier: emailAddress,
        password: password
      })

      if(complete_signIn.status === "needs_first_factor"){
        toast.error("Need to verify email")
        router.push("/")
      }

      if(complete_signIn.status === "complete"){
        await setActive({session: complete_signIn.createdSessionId})
        toast.success("Signed in successfully!");
        router.push("/dashboard")
      }

    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || "Sign-in failed");
    }
    finally{
      setLoading(false)
    }
  }


 return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Welcome Back
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-medium"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default page