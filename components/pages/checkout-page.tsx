"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Building2, Copy } from "lucide-react";
import { useCart } from "@/lib/cart";
import { submitOrder } from "@/app/actions/order";

const FREE_SHIPPING = 300;
const SHIPPING_COST = 8.50;

const BANK = {
  bank: "Caixa Geral de Depósitos",
  iban: "PT50 0035 0000 0000 0000 0000 0",
  bic: "CGDIPTPL",
  holder: "GMP Tools Lda",
};

function fmt(n: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase mb-1.5">{label}</label>
      {React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        className: "w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors bg-white",
      })}
    </div>
  );
}

export function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const [pending, setPending] = React.useState(false);
  const [orderNumber, setOrderNumber] = React.useState<string | null>(null);
  const [error, setError] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;
    setPending(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await submitOrder({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      company: fd.get("company") as string,
      address: fd.get("address") as string,
      city: fd.get("city") as string,
      postalCode: fd.get("postalCode") as string,
      notes: fd.get("notes") as string,
      items: JSON.stringify(items),
      subtotal,
      shipping,
      total,
    });
    setPending(false);
    if (res.success && res.orderNumber) {
      setOrderNumber(res.orderNumber);
      clear();
    } else {
      setError(res.error ?? "Erro inesperado.");
    }
  }

  function copyIban() {
    navigator.clipboard.writeText(BANK.iban.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Success state
  if (orderNumber) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-white p-10 text-center">
          <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-6" />
          <div className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">Encomenda confirmada</div>
          <h1 className="text-3xl font-medium text-black mb-2">{orderNumber}</h1>
          <p className="text-gray-500 mb-8">Recebemos a sua encomenda. Por favor efectue o pagamento por transferência bancária.</p>

          <div className="bg-gray-50 border border-gray-100 p-6 text-left mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-medium tracking-widest text-gray-400 uppercase">Dados para transferência</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Banco</span>
                <span className="font-semibold">{BANK.bank}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">IBAN</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-xs">{BANK.iban}</span>
                  <button onClick={copyIban} className="text-gray-400 hover:text-black transition-colors">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  {copied && <span className="text-xs text-green-600">Copiado!</span>}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">BIC/SWIFT</span>
                <span className="font-mono font-semibold text-xs">{BANK.bic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Titular</span>
                <span className="font-semibold">{BANK.holder}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="text-gray-500">Montante</span>
                <span className="font-medium text-black">{fmt(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Referência</span>
                <span className="font-semibold">{orderNumber}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-6">
            Após confirmação do pagamento processamos a sua encomenda. Receberá confirmação por email.
          </p>

          <Link href="/produtos" className="block w-full bg-black text-white text-sm font-semibold py-3.5 hover:bg-red-600 transition-colors text-center">
            Continuar a comprar
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-2xl font-medium text-black mb-3">Carrinho vazio</h1>
          <Link href="/produtos" className="text-sm text-red-600 underline">Ver catálogo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-screen-xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-medium text-black">Finalizar encomenda.</h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-10 grid lg:grid-cols-5 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
          {/* Contact */}
          <div className="bg-white p-6 space-y-4">
            <h2 className="text-sm font-medium text-black uppercase tracking-wider">Dados de contacto</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nome *"><input required name="name" placeholder="Nome completo" /></Field>
              <Field label="Email *"><input required name="email" type="email" placeholder="email@empresa.pt" /></Field>
              <Field label="Telefone *"><input required name="phone" type="tel" placeholder="+351 000 000 000" /></Field>
              <Field label="Empresa"><input name="company" placeholder="Nome da empresa" /></Field>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white p-6 space-y-4">
            <h2 className="text-sm font-medium text-black uppercase tracking-wider">Morada de entrega</h2>
            <Field label="Morada *"><input required name="address" placeholder="Rua, número, andar" /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Código postal *"><input required name="postalCode" placeholder="0000-000" /></Field>
              <Field label="Cidade *"><input required name="city" placeholder="Lisboa" /></Field>
            </div>
            <Field label="Observações"><textarea name="notes" rows={3} placeholder="Instruções especiais de entrega..." style={{ resize: "none" }} /></Field>
          </div>

          {/* Payment info */}
          <div className="bg-blue-50 border border-blue-100 p-5">
            <div className="text-xs font-medium tracking-wider text-blue-700 uppercase mb-2">Pagamento por transferência bancária</div>
            <p className="text-sm text-blue-700">
              Após submeter a encomenda, receberá os dados bancários para efectuar o pagamento. A encomenda é processada após confirmação da transferência.
            </p>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 p-3">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-black text-white text-sm font-semibold py-4 hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {pending ? "A processar..." : "Confirmar encomenda"}
          </button>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 sticky top-24">
            <h2 className="text-sm font-medium text-black uppercase tracking-wider mb-5">Resumo</h2>
            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.sku} className="flex justify-between gap-3 text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-400 font-mono">{item.sku}</div>
                    <div className="text-gray-900 font-medium truncate">{item.name}</div>
                    <div className="text-gray-400 text-xs">× {item.qty}</div>
                  </div>
                  <div className="font-medium text-black shrink-0">{fmt(item.price * item.qty)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envio</span>
                <span>{shipping === 0 ? <span className="text-green-600 font-semibold">Grátis</span> : fmt(shipping)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-medium text-black text-base">
                <span>Total</span><span>{fmt(total)}</span>
              </div>
              <div className="text-[10px] text-gray-400">Valores sem IVA 23%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
