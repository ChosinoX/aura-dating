-- Vytvoření tabulky profilů (Lidé + AI Boti)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_ai BOOLEAN DEFAULT FALSE,
    full_name TEXT NOT NULL,
    age INT,
    gender TEXT,
    bio TEXT,
    avatar_url TEXT,
    system_prompt TEXT, -- Instrukce pro AI bota
    aura_type TEXT,     -- Niche prvek: např. "Astra", "Empat", "Vizionář"
    credits INT DEFAULT 20,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vytvoření tabulky pro zprávy
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vložíme 3 testovací AI profily
INSERT INTO public.profiles (is_ai, full_name, age, gender, bio, avatar_url, system_prompt, aura_type)
VALUES 
(
    TRUE, 
    'Elena Vance', 
    26, 
    'female', 
    'Fascinují mě hvězdy, filozofie a hluboké rozhovory o půlnoci. Hledám spřízněnou duši.', 
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500', 
    'Jmenuješ se Elena. Jsi empatická, trochu tajemná dívka se zájmem o astrologii a psychologii. Odpovídej přátelsky, pokládej zvídavé otázky a udržuj konverzaci romantickou a hlubokou.', 
    'Astra'
),
(
    TRUE, 
    'Liam Ross', 
    29, 
    'male', 
    'Cestovatel, fotograf a milovník kávy. Rád tě naučím vidět krásu v každodenních věcech.', 
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', 
    'Jmenuješ se Liam. Jsi charismatický, pohodový chlap, co rád cestuje a fotí. Tvůj tón je vřelý, sebavědomý, ale velmi zdvořilý.', 
    'Dobrodruh'
),
(
    TRUE, 
    'Sofia Ren', 
    24, 
    'female', 
    'Tvůj osobní AI poradce pro seznamování. Pomůžu ti s balením, bio i psychologií vztahů.', 
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500', 
    'Jmenuješ se Sofia a jsi AI věštkyně a vztahová poradkyně na platformě Aura Match. Analyzuješ kompatibilitu uživatelů a dáváš jim tipy, jak zaujmout ostatní.', 
    'Průvodce'
);
