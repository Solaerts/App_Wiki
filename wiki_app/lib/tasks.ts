'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

const tasks: { title: string; done: boolean; }[] = []

export async function getTasks() {
  return tasks
}

export async function createTask(form: FormData) {
  tasks.push({
    title: String(form.get('title')),
    done: false,
  })
  redirect((await headers()).get('referer') ?? '/')
}