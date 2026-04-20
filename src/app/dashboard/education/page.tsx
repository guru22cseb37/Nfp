'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Brain, Zap, Clock, Heart, Shield, Dumbbell, BookOpen } from 'lucide-react';

interface Module {
  id: string;
  icon: React.ElementType;
  color: string;
  badge: string;
  title: string;
  summary: string;
  content: string;
  readTime: string;
}

const modules: Module[] = [
  {
    id: 'neuroscience',
    icon: Brain,
    color: '#6ba3be',
    badge: 'Neuroscience',
    title: 'How Pornography Rewires Your Brain',
    summary: 'Understanding the neurological impact of compulsive porn use on the dopamine system.',
    readTime: '5 min read',
    content: `**The Dopamine Loop**

When you view pornography, your brain releases a powerful surge of dopamine — the same chemical involved in all pleasure and reward. In natural contexts, dopamine rewards adaptive behaviors like eating or human connection. Compulsive pornography use hijacks this system.

**Desensitization**

Over time, your brain adapts to the supernormal stimuli by *downregulating* dopamine receptors — meaning you need more intense or novel content to feel the same "high." This is the same mechanism seen in substance addiction. Research by neuroscientist Valerie Voon (Cambridge, 2014) showed that the brains of compulsive porn users lit up similarly to cocaine addicts when shown their "drug."

**The Good News: Neuroplasticity**

Your brain is not permanently damaged. The same plasticity that allowed it to be "rewired" toward compulsive behavior will allow it to rewire back toward health. Studies show measurable recovery in dopamine receptor density within weeks to months of abstinence.

**What Happens During Recovery**
- Days 1–14: Withdrawal symptoms (irritability, brain fog, flatline libido) as dopamine normalizes
- Days 15–30: Improved mood, clarity, motivation begin to emerge
- Days 30–90: Dopamine receptors begin to resensitize
- Days 90+: Significant neurological healing, with improvements in emotional regulation, focus, and real-life attraction`,
  },
  {
    id: 'dopamine-reset',
    icon: Zap,
    color: '#f0a500',
    badge: 'Recovery Science',
    title: 'The Dopamine Reset Timeline',
    summary: 'A week-by-week breakdown of what your brain and body experience during recovery.',
    readTime: '4 min read',
    content: `**Why a Reset?**

Your dopamine baseline has been artificially elevated by superstimulating content. A "reset" means returning it to natural, healthy levels where real-life pleasures feel rewarding again.

**Week 1 (Days 1–7): The Storm**
- Intense urges, irritability, anxiety, restlessness
- Brain is still expecting the dopamine hit — be patient and compassionate with yourself
- Strategy: Urge surfing, cold showers, vigorous exercise, calling someone

**Week 2 (Days 8–14): The Fog**
- Urges may lessen but "flatline" effects may emerge (low mood, low libido)
- This is normal — it's withdrawal, not permanent
- Strategy: Social connection, sunlight, sleep optimization

**Week 3–4 (Days 15–30): The Shift**
- Brain fog begins to lift
- Genuine joy in small things re-emerges
- Real-world attraction may return
- Strategy: Build new routines, identify triggers, journal

**Days 30–90: The Rebuild**
- Dopamine system continues healing
- Emotional regulation improves significantly
- Many men report increased confidence, drive, and presence
- Strategy: Fill the void with meaningful activity — fitness, creativity, relationships

**Day 90+: The New Normal**
- Compulsive patterns largely broken for most people
- Real intimacy feels natural again
- Continue protecting your environment and building coping skills`,
  },
  {
    id: 'withdrawal',
    icon: Clock,
    color: '#e07070',
    badge: 'What to Expect',
    title: 'Understanding Withdrawal & The Flatline',
    summary: 'The flatline is temporary. Here\'s how to navigate it without giving up.',
    readTime: '4 min read',
    content: `**What Is the Flatline?**

The "flatline" is a period — typically occurring between days 14 and 60 — where motivation drops, libido disappears, and you may feel emotionally numb. Many men mistake this as permanent and relapse. It is not permanent. It is your brain healing.

**Why It Happens**

As artificial dopamine stimulation is removed, your brain temporarily undershoots its baseline. This is similar to SSRI discontinuation syndrome or post-alcohol withdrawal — a temporary anhedonia (inability to feel pleasure).

**Physical Symptoms May Include**
- Low or absent libido
- Fatigue and lethargy
- Emotional numbness or depression
- Brain fog and difficulty concentrating
- Social withdrawal

**This Is Healing, Not Failure**

Every day through the flatline is a day your nervous system is recalibrating. The discomfort is evidence that your brain is working to restore natural equilibrium.

**Strategies for the Flatline**
1. **Move your body** — Exercise is the single most effective natural dopamine regulator
2. **Protect your sleep** — 8 hours of quality sleep accelerates neural repair
3. **Social connection** — Oxytocin (the bonding hormone) supports dopamine recovery
4. **Journaling** — Externalizing the flatline makes it less terrifying
5. **Cold exposure** — Cold showers activate norepinephrine and dopamine acutely
6. **Accept, don't fight** — Mindful acceptance of discomfort prevents amplification`,
  },
  {
    id: 'urge-surfing',
    icon: Heart,
    color: '#76ab87',
    badge: 'CBT Technique',
    title: 'Urge Surfing: Your Most Powerful Tool',
    summary: 'Learn the evidence-based technique used in addiction treatment worldwide.',
    readTime: '3 min read',
    content: `**What Is Urge Surfing?**

Developed by psychologist G. Alan Marlatt, urge surfing is a mindfulness-based technique that helps you observe cravings without acting on them. The metaphor: urges are like ocean waves — they rise, peak, and fall. You don't fight the wave; you surf it.

**The Science**

Urges typically peak within 15–30 minutes and then naturally subside. When we try to suppress or fight an urge, we amplify it (the "white bear" effect). When we observe it with curiosity and non-judgment, its power diminishes.

**How to Urge Surf**

1. **Notice** — "I notice I'm having an urge."
2. **Label** — "This is an urge. It is not a command."
3. **Locate** — Where do you feel it in your body? Chest? Stomach? Throat?
4. **Observe** — Watch it like a wave. Is it getting stronger? Peaking? Falling?
5. **Breathe** — Use 4-7-8 breathing: inhale 4, hold 7, exhale 8
6. **Wait** — Most urges pass within 20–30 minutes if not fueled

**Mindset Shift**

You are not your urge. You are the one *observing* the urge. That space between stimulus and response is where your freedom lives.

**When to Use It**
- When you feel a sudden, intense urge
- When boredom or loneliness triggers the pull
- When you're alone and vulnerable
- As a daily mindfulness practice to build the "urge muscle"`,
  },
  {
    id: 'coping',
    icon: Shield,
    color: '#a8cdb5',
    badge: 'Coping Strategies',
    title: '10 Healthy Coping Strategies That Actually Work',
    summary: 'Replace compulsive behavior with evidence-backed alternatives that satisfy the same needs.',
    readTime: '5 min read',
    content: `Pornography often meets underlying needs — stress relief, loneliness, boredom, escape. Lasting recovery requires replacing it with behaviors that meet those same needs healthily.

**1. Vigorous Exercise**
The most evidence-backed intervention. 30+ minutes of cardio or strength training floods your brain with endorphins, dopamine, and serotonin — a natural "high" with lasting benefits.

**2. Cold Showers**
Cold exposure triggers a 250–300% increase in norepinephrine and dopamine. It also builds distress tolerance — a core skill in addiction recovery.

**3. The 5-Minute Rule**
When an urge hits, commit to just 5 minutes of a healthy activity. Run, do push-ups, call a friend, cook something. The urge usually passes.

**4. Environment Design**
Remove access points. Use content filters (Cold Turkey, Freedom), move your computer to a shared space, delete apps that trigger you. Environment is behavior.

**5. Journaling**
Write about what preceded the urge. Identifying triggers gives you power over them. Write freely, without judgment.

**6. Social Connection**
Loneliness is a primary trigger. Text a friend, join a group, volunteer. Human connection activates the same reward circuits — naturally.

**7. Sleep Hygiene**
Sleep deprivation impairs the prefrontal cortex — the part of your brain that enables impulse control. Prioritize 7–9 hours.

**8. Mindfulness Meditation**
Even 10 minutes daily measurably thickens the prefrontal cortex and improves impulse control. Apps like Insight Timer are free.

**9. The Accountability Partner**
Tell someone you trust about your goal. The power of accountability is one of the most well-documented factors in addiction recovery.

**10. Professional Therapy**
If self-help isn't enough, Cognitive Behavioral Therapy (CBT) and EMDR have strong evidence bases for compulsive sexual behavior. Seeking help is strength.`,
  },
  {
    id: 'self-compassion',
    icon: Dumbbell,
    color: '#d4c4b5',
    badge: 'Recovery Mindset',
    title: 'Why Self-Compassion Is a Recovery Tool',
    summary: 'Shame drives relapse. Self-compassion drives recovery. Here\'s the science.',
    readTime: '3 min read',
    content: `**The Shame-Relapse Cycle**

Research by Dr. Brené Brown and addiction specialist Dr. Gabor Maté consistently shows that shame — "I am bad" — increases the likelihood of relapse, while guilt — "I did something I regret" — can motivate change.

When we shame ourselves after a relapse, we activate the same stress circuits that triggered the behavior in the first place. Shame says "I'm broken and hopeless." That hopelessness is exactly the emotional state that porn use promises (falsely) to relieve.

**What Self-Compassion Is Not**

Self-compassion is not:
- Making excuses for behavior
- Giving up on standards
- Being "soft" on yourself

Self-compassion IS:
- Treating yourself with the same kindness you'd offer a struggling friend
- Acknowledging pain without drowning in it
- Recommitting to your values from a place of love, not fear

**Dr. Kristin Neff's Three Elements**

1. **Self-kindness** — Speak to yourself gently after a relapse
2. **Common humanity** — You are not alone in this struggle. Millions of men face it.
3. **Mindfulness** — Observe your pain without over-identifying with it

**Practical Exercise**

After a relapse, write this down:
*"I made a choice I regret. I am human. I am learning. I choose to begin again."*

Then take one action — however small — that a self-caring person would take. Drink water. Sleep. Exercise. Connect. That action is the beginning of day one.`,
  },
];

function ModuleCard({ module, index }: { module: Module; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="edu-card"
    >
      <button
        id={`edu-module-${module.id}`}
        className="edu-card-header"
        onClick={() => setOpen((v) => !v)}
        style={{ width: '100%', border: 'none', background: 'transparent', color: 'inherit', textAlign: 'left', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `${module.color}18`, border: `1px solid ${module.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <module.icon size={20} color={module.color} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: `${module.color}15`, color: module.color, border: `1px solid ${module.color}30`, fontSize: 11 }}>
                {module.badge}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{module.readTime}</span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>{module.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>{module.summary}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ flexShrink: 0, color: 'var(--text-muted)' }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="edu-card-body">
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                {module.content.split('\n\n').map((para, i) => {
                  if (para.startsWith('**') && para.endsWith('**')) {
                    return (
                      <h4 key={i} style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, marginTop: i > 0 ? 20 : 0 }}>
                        {para.replace(/\*\*/g, '')}
                      </h4>
                    );
                  }
                  // Handle inline bold
                  const parts = para.split(/\*\*(.*?)\*\*/g);
                  if (para.startsWith('- ')) {
                    return (
                      <li key={i} style={{ marginLeft: 16, marginBottom: 6, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
                        {para.slice(2)}
                      </li>
                    );
                  }
                  if (/^\d+\./.test(para)) {
                    return (
                      <div key={i} style={{ marginBottom: 8, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
                        {para}
                      </div>
                    );
                  }
                  return (
                    <p key={i} style={{ marginBottom: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
                      {parts.map((part, j) =>
                        j % 2 === 1 ? <strong key={j} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{part}</strong> : part
                      )}
                    </p>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function EducationPage() {
  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: 24 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(74,124,89,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={20} color="var(--sage-400)" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Education Hub</h1>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Science-backed knowledge for your recovery. Understanding your brain empowers your healing.
        </p>
      </motion.div>

      {/* Modules */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {modules.map((m, i) => (
          <ModuleCard key={m.id} module={m} index={i} />
        ))}
      </div>

      {/* Footer disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ marginTop: 28, padding: '16px 20px', borderRadius: 14, background: 'rgba(107,163,190,0.08)', border: '1px solid rgba(107,163,190,0.2)', textAlign: 'center' }}
      >
        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          All content is for educational purposes. FreedomPath is not a substitute for professional mental health treatment.
          If you&apos;re struggling, please reach out to a licensed therapist or call <strong style={{ color: 'var(--sky-calm)' }}>988</strong> (Suicide & Crisis Lifeline).
        </p>
      </motion.div>
    </div>
  );
}
