import { createContext } from "react"
import { CalculateDonationPointsRef } from "../home/CalculateDonationPoints"

export const CalculateDonationPointsContext = createContext<CalculateDonationPointsRef | null>(null)
