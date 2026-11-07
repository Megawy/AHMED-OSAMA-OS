import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tech-icon',
  standalone: true,
  template: `
    @switch (key()) {
      @case ('angular') {
        <svg viewBox="0 0 256 256" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <path fill="#E23237" d="M128 0L0 45.7v137.1L128 256l128-73.2V45.7L128 0z" />
          <path fill="#B52E31" d="M128 0v256l128-73.2V45.7L128 0z" />
          <path fill="#FFF" d="M128 32.5l57.1 130.1h-24.9l-11.4-28.5H107l-11.4 28.5H70.7L128 32.5zm14.3 80.8L128 69.8l-14.3 43.5h28.6z" />
        </svg>
      }

      @case ('dotnet') {
        <svg viewBox="0 0 256 256" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <rect width="256" height="256" rx="55" fill="#512BD4" />
          <path fill="#FFF" d="M48 148v-40h12v40H48zm34-40h12l20 28v-28h12v40H114l-20-28v28H82v-40zm56 0h34v10h-22v6h20v9h-20v6h23v9h-35v-40zm50 10h-14v-10h40v10h-14v30h-12v-30z" />
        </svg>
      }

      @case ('python') {
        <svg viewBox="0 0 256 255" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <defs>
            <linearGradient id="pyA" x1="12.96%" y1="8.3%" x2="79.91%" y2="78.78%"><stop offset="0%" stop-color="#387EB8"/><stop offset="100%" stop-color="#366994"/></linearGradient>
            <linearGradient id="pyB" x1="19.13%" y1="20.58%" x2="90.8%" y2="84.28%"><stop offset="0%" stop-color="#FFE873"/><stop offset="100%" stop-color="#FFD43B"/></linearGradient>
          </defs>
          <path fill="url(#pyA)" d="M126.9 0C60 0 63.8 29 63.8 29l.1 30.1h64.3v9.1H38.5S0 63.8 0 128.5c0 64.6 33.6 62.4 33.6 62.4h20.1v-28.3s-1.1-33.6 33-33.6h53.7s31.9.5 31.9-30.8V33.6S176.4 0 126.9 0zm-27.1 19.3c5.8 0 10.4 4.7 10.4 10.4 0 5.8-4.7 10.4-10.4 10.4-5.8 0-10.4-4.7-10.4-10.4 0-5.8 4.6-10.4 10.4-10.4z"/>
          <path fill="url(#pyB)" d="M129.1 254.9c66.9 0 63.1-29 63.1-29l-.1-30.1h-64.3v-9.1h89.7s38.5 4.4 38.5-60.3c0-64.6-33.6-62.4-33.6-62.4h-20.1v28.3s1.1 33.6-33 33.6h-53.7s-31.9-.5-31.9 30.8v64.6s-4.1 33.6 45.4 33.6zm27.1-19.3c-5.8 0-10.4-4.7-10.4-10.4 0-5.8 4.7-10.4 10.4-10.4 5.8 0 10.4 4.7 10.4 10.4 0 5.8-4.6 10.4-10.4 10.4z"/>
        </svg>
      }

      @case ('django') {
        <svg viewBox="0 0 256 256" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <rect width="256" height="256" rx="40" fill="#092E20" />
          <path fill="#FFF" d="M137 60h25v88c0 28-15 42-41 42-12 0-23-3-29-8l8-20c5 3 11 5 18 5 15 0 23-8 23-24V60h-4zm-42 41c0-14 9-22 23-22v74c-14 0-23-9-23-23v-29zm-2-21h25v22c-7-3-15-4-23-4-25 0-41 17-41 42v30c0 25 16 42 41 42 8 0 16-1 23-4v22c-8 3-17 4-27 4-38 0-62-27-62-64v-30c0-37 24-64 62-64 10 0 19 1 27 4v-20h-25v-24z"/>
        </svg>
      }

      @case ('typescript') {
        <svg viewBox="0 0 256 256" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <rect width="256" height="256" rx="40" fill="#3178C6" />
          <path fill="#FFF" d="M135 158.7c0 8.6-4.5 13-13.6 13.1-4.7 0-9.2-1.2-13.6-3.7v16.3a40.7 40.7 0 0017.5 3.9c19 0 28.6-8.9 28.6-26.6V77h-18.9v81.7zm65.7-36.9c-8.9-5.1-17.7-7.7-26.5-7.7-7.2 0-12.8 1.8-16.8 5.4-4 3.6-6 8.5-6 14.6 0 5.4 1.8 10 5.4 13.6 3.6 3.7 9.8 7.3 18.6 11 11.4 4.8 19.8 10.3 25.1 16.5 5.3 6.2 8 13.9 8 23 0 11.2-4.4 20.3-13.2 27.2-8.8 6.9-20.9 10.4-36.3 10.4-11.4 0-21.4-2.6-30.1-7.8l6.3-16.1a57.2 57.2 0 0026.3 8.1c8.4 0 15-2.1 19.7-6.2 4.7-4.1 7-9.5 7-16.2 0-5.8-1.9-10.6-5.8-14.3-3.8-3.7-10.7-7.5-20.6-11.5-10.4-4.2-18-9.4-22.9-15.6s-7.3-13.6-7.3-22.2c0-10.6 4.3-19.1 12.8-25.5 8.5-6.4 19.8-9.6 33.9-9.6 10.1 0 19.1 2 27 6l-6.6 16.5z" />
        </svg>
      }

      @case ('javascript') {
        <svg viewBox="0 0 256 256" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <rect width="256" height="256" rx="40" fill="#F7DF1E" />
          <path fill="#000" d="M67 179c4 7 9 12 18 12 9 0 14-5 14-15v-72H80v-16h38v88c0 19-11 28-28 28-15 0-25-8-30-19l7-6zm75-2c5 8 13 14 25 14 11 0 18-6 18-13 0-9-7-12-20-18l-7-3c-20-8-33-19-33-41 0-20 16-36 41-36 18 0 30 6 38 21l-14 9c-4-8-10-12-24-12-11 0-17 6-17 13 0 8 7 11 19 16l7 3c24 10 35 21 35 43 0 25-19 37-43 37-24 0-39-12-46-26l17-8z" />
        </svg>
      }

      @case ('nextjs') {
        <svg viewBox="0 0 180 180" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <circle cx="90" cy="90" r="90" fill="#000" />
          <path fill="#FFF" d="M149.5 148.6L67 42H50v96h14.5V60.4l72.4 94.3c4.1-1.9 8-4 12.6-6.1z" />
          <path fill="#FFF" d="M115 42h15v56.5l-15-19.5V42z" />
        </svg>
      }

      @case ('react') {
        <svg viewBox="0 0 115 100" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <circle cx="57.5" cy="50" r="8.5" fill="#61DAFB" />
          <g stroke="#61DAFB" stroke-width="5" fill="none">
            <ellipse cx="57.5" cy="50" rx="55" ry="21" />
            <ellipse cx="57.5" cy="50" rx="55" ry="21" transform="rotate(60 57.5 50)" />
            <ellipse cx="57.5" cy="50" rx="55" ry="21" transform="rotate(120 57.5 50)" />
          </g>
        </svg>
      }

      @case ('nodejs') {
        <svg viewBox="0 0 256 289" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <path fill="#539E43" d="M128 0L0 74v141l128 74 128-74V74L128 0zm-15 220l-57-33V89l57-33 57 33v98l-57 33z" />
        </svg>
      }

      @case ('rxjs') {
        <svg viewBox="0 0 256 256" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <circle cx="128" cy="128" r="128" fill="#B7178C" />
          <path fill="#FFF" d="M113 54c-12 18-19 39-19 61 0 50 36 91 84 99-8 7-18 12-30 14-41 7-79-21-85-62s21-79 62-85c13-2 26-1 38 3-16-16-33-25-50-30z" />
        </svg>
      }

      @case ('tailwind') {
        <svg viewBox="0 0 256 154" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <path fill="#38BDF8" d="M128 0C90 0 67 19 58 58c14-19 31-27 51-22 11 3 20 11 29 20 14 15 31 32 68 32 38 0 61-19 70-58-14 19-31 27-51 22-11-3-20-11-29-20-14-15-31-32-68-32zM58 66C20 66-3 85-12 124c14-19 31-27 51-22 11 3 20 11 29 20 14 15 31 32 68 32 38 0 61-19 70-58-14 19-31 27-51 22-11-3-20-11-29-20-14-15-31-32-68-32z" />
        </svg>
      }

      @case ('docker') {
        <svg viewBox="0 0 256 195" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <path fill="#2496ED" d="M255 93c-2-1-19-11-40-3 0 0-4-15-18-24l-8 7c10 7 13 18 13 18s-11-4-25 1c0 0-4-8-12-14l-8 5c6 5 8 11 8 11-3-1-11-2-21 0-7-23-30-22-30-22v15h11v15H102V79h11V64H77v15h11V64H52v15h11V64H27v15h11V64H2c-3 15 3 32 17 44 14 12 36 17 58 17 65 0 116-35 137-77 15 0 29 7 36 16l5-4v33zm-137 9H94V87h24v15zm0-22H94V65h24v15zm25 22h-19V87h19v15zm0-22h-19V65h19v15z" />
        </svg>
      }

      @case ('kubernetes') {
        <svg viewBox="0 0 256 250" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <path fill="#326CE5" d="M128 0L17 64v122l111 64 111-64V64L128 0zm-8 42c3 0 5 2 5 5v14c7 1 14 3 21 6l10-10c2-2 5-2 7 0l11 11c2 2 2 5 0 7l-10 10c3 7 5 14 6 21h14c3 0 5 2 5 5v16c0 3-2 5-5 5h-14c-1 7-3 14-6 21l10 10c2 2 2 5 0 7l-11 11c-2 2-5 2-7 0l-10-10c-7 3-14 5-21 6v14c0 3-2 5-5 5h-16c-3 0-5-2-5-5v-14c-7-1-14-3-21-6l-10 10c-2 2-5 2-7 0L77 175c-2-2-2-5 0-7l10-10c-3-7-5-14-6-21H67c-3 0-5-2-5-5v-16c0-3 2-5 5-5h14c1-7 3-14 6-21L77 81c-2-2-2-5 0-7l11-11c2-2 5-2 7 0l10 10c7-3 14-5 21-6V47c0-3 2-5 5-5h16zm8 46c-21 0-38 17-38 38s17 38 38 38 38-17 38-38-17-38-38-38zm0 21c9 0 17 8 17 17s-8 17-17 17-17-8-17-17 8-17 17-17z" />
        </svg>
      }

      @case ('kafka') {
        <svg viewBox="0 0 256 388" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <path fill="#E2E8F0" d="M135 152l82-62a52 52 0 10-15-20l-88 66v-25a52 52 0 10-25 0v167a52 52 0 1025 0v-25l88 66a52 52 0 1015-20l-82-62 57-43-57-42zM218 52a27 27 0 11-27 27 27 27 0 0127-27zm-116 27a27 27 0 11-27-27 27 27 0 0127 27zm0 230a27 27 0 11-27-27 27 27 0 0127 27zm116 27a27 27 0 11-27-27 27 27 0 0127 27z" />
        </svg>
      }

      @case ('redis') {
        <svg viewBox="0 0 256 220" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <path fill="#DC382D" d="M0 64l128-64 128 64-128 64L0 64zm0 46l128 64 128-64v23l-128 64L0 133v-23zm0 46l128 64 128-64v23l-128 64L0 179v-23z" />
        </svg>
      }

      @case ('postgres') {
        <svg viewBox="0 0 256 264" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <path fill="#4169E1" d="M125 0C56 0 0 56 0 125c0 47 26 88 64 109v-42c-21-17-35-43-35-72 0-51 41-92 92-92s92 41 92 92c0 29-14 55-35 72v42c38-21 64-62 64-109 0-69-56-125-125-125zm1 140c-18 0-33 15-33 33 0 18 15 33 33 33s33-15 33-33c0-18-15-33-33-33z" />
        </svg>
      }

      @case ('sqlite') {
        <svg viewBox="0 0 256 256" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <rect width="256" height="256" rx="40" fill="#003B57" />
          <path fill="#00ADEF" d="M128 40c-48 0-88 18-88 40v96c0 22 40 40 88 40s88-18 88-40V80c0-22-40-40-88-40zm0 24c36 0 64 12 64 16s-28 16-64 16-64-12-64-16 28-16 64-16zm0 136c-36 0-64-12-64-16v-22c15 11 38 18 64 18s49-7 64-18v22c0 4-28 16-64 16zm0-44c-36 0-64-12-64-16v-22c15 11 38 18 64 18s49-7 64-18v22c0 4-28 16-64 16z" />
        </svg>
      }

      @case ('sqlserver') {
        <svg viewBox="0 0 256 256" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <ellipse cx="128" cy="56" rx="96" ry="32" fill="#E2231A" />
          <path fill="#E2231A" d="M32 56v72c0 18 43 32 96 32s96-14 96-32V56H32z" />
          <path fill="#C41913" d="M32 128v72c0 18 43 32 96 32s96-14 96-32v-72c0 18-43 32-96 32s-96-14-96-32z" />
        </svg>
      }

      @case ('mongodb') {
        <svg viewBox="0 0 128 276" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <path fill="#47A248" d="M64 0C58 41 0 120 0 180c0 52 35 96 64 96s64-44 64-96c0-60-58-139-64-180zm0 252c-15 0-48-26-48-72 0-38 31-89 48-125v197z" />
        </svg>
      }

      @case ('supabase') {
        <svg viewBox="0 0 256 265" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <path fill="#3ECF8E" d="M141 265c-6 8-18 4-18-6l2-106H19c-14 0-21-17-12-27L123 2c6-8 18-4 18 6l-2 106h106c14 0 21 17 12 27L141 265z" />
        </svg>
      }

      @case ('rabbitmq') {
        <svg viewBox="0 0 256 250" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <path fill="#FF6600" d="M228 150c-3-22-16-41-35-51 2-8 3-17 3-25 0-33-27-60-60-60-14 0-27 5-37 13-10-8-23-13-37-13C29 14 2 41 2 74c0 8 1 17 3 25-19 10-32 29-35 51-4 28 8 55 31 71l18 12c14 9 30 14 47 14h128c17 0 33-5 47-14l18-12c23-16 35-43 31-71zm-98-96c11 0 20 9 20 20s-9 20-20 20-20-9-20-20 9-20 20-20z" />
        </svg>
      }

      @case ('signalr') {
        <svg viewBox="0 0 256 256" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <circle cx="128" cy="128" r="128" fill="#5C2D91" />
          <path fill="#FFF" d="M128 50c-43 0-78 35-78 78s35 78 78 78 78-35 78-78-35-78-78-78zm0 24c30 0 54 24 54 54s-24 54-54 54-54-24-54-54 24-54 54-54zm0 24c-17 0-30 13-30 30s13 30 30 30 30-13 30-30-13-30-30-30z" />
        </svg>
      }

      @case ('grpc') {
        <svg viewBox="0 0 256 256" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <rect width="256" height="256" rx="40" fill="#244C5A" />
          <path fill="#FFF" d="M68 96c0-22 18-40 40-40h40c22 0 40 18 40 40v30h-24V96c0-9-7-16-16-16h-40c-9 0-16 7-16 16v64c0 9 7 16 16 16h40c9 0 16-7 16-16v-14h-30v-20h54v34c0 22-18 40-40 40h-40c-22 0-40-18-40-40V96z" />
        </svg>
      }

      @case ('opentelemetry') {
        <svg viewBox="0 0 256 256" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <circle cx="128" cy="128" r="128" fill="#425CC7" />
          <path fill="#FFF" d="M128 48c44 0 80 36 80 80s-36 80-80 80-80-36-80-80 36-80 80-80zm0 30c-28 0-50 22-50 50s22 50 50 50 50-22 50-50-22-50-50-50zm0 25c14 0 25 11 25 25s-11 25-25 25-25-11-25-25 11-25 25-25z" />
        </svg>
      }

      @case ('microservices') {
        <svg viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <rect x="2" y="2" width="6" height="6" rx="1" />
          <rect x="16" y="2" width="6" height="6" rx="1" />
          <rect x="9" y="16" width="6" height="6" rx="1" />
          <path d="M5 8v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
          <path d="M12 12v4" />
        </svg>
      }

      @case ('git') {
        <svg viewBox="0 0 256 256" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <path fill="#F05032" d="M251 113L143 5c-6-7-16-7-23 0l-22 23 30 30c6-2 14-1 19 4 6 5 7 13 4 19l29 29c6-3 14-2 19 3 8 8 8 20 0 28s-20 8-28 0c-6-6-7-14-3-21L139 93v69c2 1 4 2 5 4 8 8 8 20 0 28s-20 8-28 0c-8-8-8-20 0-28 3-3 6-5 10-6v-69c-4-1-7-3-10-6-6-6-7-14-3-21L84 35 5 113c-7 6-7 16 0 23l108 108c6 7 16 7 23 0l115-115c6-7 6-17 0-23z" />
        </svg>
      }

      @case ('gitlab') {
        <svg viewBox="0 0 256 256" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <path fill="#E24329" d="M128 235l58-179H70l58 179z"/>
          <path fill="#FC6D26" d="M128 235L70 56H18l110 179zm0 0l58-179h52L128 235z"/>
          <path fill="#FCA326" d="M18 56L2 107a9 9 0 003 10l123 118L70 56H18zm220 0l16 51a9 9 0 01-3 10L128 235l58-179h52z"/>
        </svg>
      }

      @case ('github') {
        <svg viewBox="0 0 256 256" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <circle cx="128" cy="128" r="128" fill="#181717" />
          <path fill="#FFF" d="M128 32C75 32 32 75 32 128c0 42 27 78 65 91 5 1 6-2 6-5v-17c-27 6-32-13-32-13-4-11-11-14-11-14-9-6 1-6 1-6 10 1 15 10 15 10 9 15 23 11 28 8 1-6 3-11 6-13-21-2-44-11-44-47 0-10 4-19 10-26-1-2-4-12 1-25 0 0 8-3 27 10 8-2 16-3 24-3s17 1 24 3c19-13 27-10 27-10 5 13 2 23 1 25 6 7 10 16 10 26 0 37-23 45-44 47 4 3 7 10 7 19v29c0 3 2 6 7 5 38-13 65-49 65-91 0-53-43-96-96-96z" />
        </svg>
      }

      @case ('nginx') {
        <svg viewBox="0 0 256 256" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <path fill="#009639" d="M128 0L17 64v128l111 64 111-64V64L128 0zm68 181h-24l-53-76v76H95V75h24l53 76V75h24v106z"/>
        </svg>
      }

      @case ('primeng') {
        <svg viewBox="0 0 256 256" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <rect width="256" height="256" rx="40" fill="#E23237" />
          <path fill="#FFF" d="M80 60h60c28 0 46 16 46 40s-18 40-46 40h-32v56H80V60zm28 26v28h30c12 0 20-6 20-14s-8-14-20-14h-30z" />
        </svg>
      }

      @case ('figma') {
        <svg viewBox="0 0 256 384" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <path fill="#0ACF83" d="M64 384c35 0 64-29 64-64v-64H64c-35 0-64 29-64 64s29 64 64 64z" />
          <path fill="#A259FF" d="M0 192c0-35 29-64 64-64h64v128H64c-35 0-64-29-64-64z" />
          <path fill="#F24E1E" d="M0 64C0 29 29 0 64 0h64v128H64C29 128 0 99 0 64z" />
          <path fill="#FF7262" d="M128 0h64c35 0 64 29 64 64s-29 64-64 64h-64V0z" />
          <circle cx="192" cy="192" r="64" fill="#1ABCFE" />
        </svg>
      }

      @default {
        <span class="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
      }
    }
  `,
})
export class TechIconComponent {
  readonly key = input.required<string>();
}
