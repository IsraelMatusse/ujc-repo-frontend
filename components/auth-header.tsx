"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Upload, User, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export function AuthHeader() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/login">
            <Upload className="h-4 w-4 mr-2" />
            Contribuir
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/login">Entrar</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="sm" asChild>
        <Link href="/upload">
          <Upload className="h-4 w-4 mr-2" />
          Contribuir
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-600 text-white">
                {user.fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{user.fullName}</p>
              <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user.role === "ADMIN" ? "Administrador" : "Estudante"}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </Link>
          </DropdownMenuItem>
          {user.role === "ADMIN" && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <Settings className="mr-2 h-4 w-4" />
                Administração
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
