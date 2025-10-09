"use client"

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSignIn } from '@clerk/nextjs'
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
        setActive({session: complete_signIn.createdSessionId})
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-20">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Input
        type="email"
        placeholder="Email"
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}

export default page