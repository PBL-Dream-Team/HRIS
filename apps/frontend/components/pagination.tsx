"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function PaginationFooter({ totalItems, itemsPerPage }: { totalItems: number, itemsPerPage: number }) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex items-center justify-between p-4 border-t">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{startItem}</span> to{" "}
        <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{totalItems}</span> results
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentPage === 1}>
          &lt;
        </Button>
        <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
        <Button variant="outline" size="sm" onClick={handleNext} disabled={currentPage === totalPages}>
          &gt;
        </Button>
      </div>
    </div>
  )
}
