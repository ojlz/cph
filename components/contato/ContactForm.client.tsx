"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Send, CheckCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  subject: z.string().refine((v) => ["avaliacao", "sugestao", "critica", "outro"].includes(v), {
    message: "Selecione um assunto",
  }),
  rating: z.number().min(1).max(5).optional(),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

type FormData = z.infer<typeof schema>;

const subjects = [
  { value: "", label: "Selecione o assunto" },
  { value: "avaliacao", label: "Avaliação" },
  { value: "sugestao", label: "Sugestão" },
  { value: "critica", label: "Crítica" },
  { value: "outro", label: "Outro" },
];

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [subject, setSubject] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/contato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl bg-card border border-border/50 p-8 text-center">
        <CheckCircle size={40} className="text-primary mx-auto mb-4" />
        <h3 className="font-display text-xl font-semibold text-white mb-2">
          Mensagem enviada!
        </h3>
        <p className="text-muted-foreground">
          Obrigado pelo contato. Responderemos em breve.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl bg-card border border-border/50 p-6 md:p-8 space-y-5"
    >
      <h3 className="font-display text-lg font-semibold text-white">
        Envie sua mensagem
      </h3>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
          Nome
        </label>
        <input
          id="name"
          {...register("name")}
          className={cn(
            "w-full rounded-xl bg-secondary border border-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all",
            errors.name && "ring-2 ring-destructive"
          )}
          placeholder="Seu nome"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
          Email <span className="text-muted-foreground">(opcional)</span>
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={cn(
            "w-full rounded-xl bg-secondary border border-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all",
            errors.email && "ring-2 ring-destructive"
          )}
          placeholder="seu@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">
          Assunto
        </label>
        <select
          id="subject"
          value={subject}
          {...register("subject", {
            onChange: (e) => {
              setSubject(e.target.value);
              if (e.target.value !== "avaliacao") {
                setRating(0);
                setValue("rating", undefined);
              }
            },
          })}
          className={cn(
            "w-full rounded-xl bg-secondary border border-input px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all",
            errors.subject && "ring-2 ring-destructive"
          )}
        >
          {subjects.map((s) => (
            <option key={s.value} value={s.value} disabled={s.value === ""}>
              {s.label}
            </option>
          ))}
        </select>
        {errors.subject && (
          <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>
        )}
      </div>

      {subject === "avaliacao" && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Sua nota
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setRating(star);
                  setValue("rating", star);
                }}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="p-0.5 transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  size={28}
                  className={cn(
                    "transition-colors",
                    star <= (hovered || rating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
          Mensagem
        </label>
        <textarea
          id="message"
          {...register("message")}
          rows={4}
          className={cn(
            "w-full rounded-xl bg-secondary border border-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none",
            errors.message && "ring-2 ring-destructive"
          )}
          placeholder="Sua mensagem..."
        />
        {errors.message && (
          <p className="mt-1 text-xs text-destructive">
            {errors.message.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          "Enviando..."
        ) : (
          <>
            Enviar Mensagem
            <Send size={16} />
          </>
        )}
      </button>
    </form>
  );
}
