import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginComponent,
})

export default function LoginComponent() {
  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <h1>Login</h1>
        <p>
          Edit <code>src/routes/login.tsx</code> and save to reload.
        </p>
      </header>
    </div>
  )
}
