"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
              Contact Us
            </h1>
            <div className="mt-6 space-y-4 text-sm text-zinc-600">
              <div>
                <p className="font-medium text-zinc-900">Nativa Agro</p>
                <p>80-83 Long Lane</p>
                <p>Saharanpur EC1A 9ET</p>
                <p className="mt-2">
                  Unfortunately, we do not offer visits for retail enquiries at this
                  time.
                </p>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Email</p>
                <p>info@NativaAgro.com</p>
                <p className="mt-1">We aim to respond within 24 hours.</p>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Phone / WhatsApp</p>
                <p>+91 203 951 7975</p>
                <p className="mt-1">Mon–Fri, 10am–4:30pm. Closed weekends.</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
              <h2 className="text-lg font-semibold tracking-wide text-zinc-900">
                Leave Your Question Here
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                We aim to respond within 24 hours.
              </p>

              {submitted ? (
                <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
                  Thanks—your message has been received.
                </div>
              ) : (
                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium tracking-wide text-zinc-700">
                        First Name*
                      </label>
                      <input
                        required
                        className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium tracking-wide text-zinc-700">
                        Last Name*
                      </label>
                      <input
                        required
                        className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium tracking-wide text-zinc-700">
                        Email*
                      </label>
                      <input
                        type="email"
                        required
                        className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium tracking-wide text-zinc-700">
                        Phone Number
                      </label>
                      <input className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium tracking-wide text-zinc-700">
                      Message
                    </label>
                    <textarea className="mt-2 h-32 w-full resize-none rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20" />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium tracking-wide text-white hover:bg-zinc-800"
                  >
                    Submit
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

