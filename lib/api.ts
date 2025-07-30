import axios from "axios";
import { getAccessToken } from "./auth";

export async function login(email: string, password: string) {
  const res = await fetch("http://test1.localhost:8000/api/token/pair", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Login failed");
  }

  return res.json();
}

// 🔽 NEW: Fetch employees from tenant schema
export async function fetchEmployees(tenant: string) {
  const token = getAccessToken();

  if (!token) {
    throw new Error("No access token found");
  }

  const apiUrl = `http://${tenant}.localhost:8000/tenant/employee/list`;

  const res = await axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; // Assuming it returns an array of employees
}
