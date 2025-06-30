import React from 'react'
import type { Route } from '../../+types/root';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TaskHub" },
    { name: "description", content: "Welcome to React Router!" },
  ];
} 

function home() {
  return (
    <div>Homepage</div>
  )
}

export default home
