import LogoURL from "@/assets/logo.png?url"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { onRender } from "@printerz-app/template-sdk"
import { useEffect, useState } from "react"

type Invoice = {
  invoiceNumber: string
  invoiceDate: string
  customer: {
    name: string
    address: string
  }
  invoiceItems: {
    name: string
    quantity: number
    unitPrice: number
  }[]
}

function App() {
  const [variables, setVariables] = useState<Partial<Invoice>>({})

  const { register, unregister } = onRender<Invoice>((printVariables) => {
    setVariables(printVariables)
  });

  useEffect(() => {
    register();

    return () => {
      unregister();
    };
  }, [register, unregister]);

  const invoiceTotal = variables.invoiceItems?.reduce((total, item) => total + item.unitPrice * item.quantity, 0)

  const locale = "fr-FR";
  const currency = "EUR";

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) {
      return ""
    }
    return Intl.NumberFormat(locale, {
      style: "currency",
      currency
    }).format(value / 100)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-100 dark:bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={LogoURL} height={20} width={150} />
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <div>Invoice {variables.invoiceNumber}</div>
            <div>{variables.invoiceDate}</div>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <div>{variables.customer?.name}</div>
          <div>{variables.customer?.address}</div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variables.invoiceItems?.map((item) => (
              <TableRow>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                <TableCell>{formatCurrency(item.unitPrice * item.quantity)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="text-right font-medium">
                Total:
              </TableCell>
              <TableCell className="font-medium">{formatCurrency(invoiceTotal)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </main>
    </div>
  )
}

export default App
