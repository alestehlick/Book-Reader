const BOOK_DATA = {
  "title": "1 — Molecular Orbital Theory",
  "language": "en",
  "sections": [
    {
      "id": "01.01",
      "number": "01.01",
      "title": "The Hydrogen 1s Orbital",
      "paragraphs": [
        {
          "id": "01.01-p001",
          "text": "[01.01-p001]\nThe simplest bond is the bond between two hydrogen atoms, and so the natural entrance into molecular orbital theory is to understand one hydrogen atom with some care. A hydrogen atom contains one proton and one electron. The central object is therefore the electron wavefunction \\(\\psi(\\mathbf{r})\\), not because the electron is a mist in any naive pictorial sense, but because quantum mechanics encodes the spatial state of the electron in that function. The measurable quantity is \\(|\\psi|^2\\), and the probability of finding the electron in a tiny volume element \\(d\\tau\\) is \\(|\\psi|^2 d\\tau\\). Normalization requires\n\\[\n\\int |\\psi|^2\\, d\\tau = 1.\n\\]\nThe wavefunction itself may be positive, negative, or even complex; only after squaring its modulus does one obtain a probability distribution.",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.01-p002",
          "text": "[01.01-p002]\nFor the hydrogen ground state the relevant orbital is the 1s orbital. It is spherically symmetric, so no direction in space is privileged. The amplitude is largest at the nucleus and then falls away rapidly with distance. This decay is so strong that about 90% of the electron probability lies within 1.4 Å of the nucleus, and more than 99% within 2 Å. The ground-state electron is bound by 13.60 eV relative to a completely separated proton and electron. Already one sees an important habit of thought: an orbital is not a little path, but a stationary distribution whose energetic meaning is inseparable from its shape.",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.01-p003",
          "text": "[01.01-p003]\nFigure 1.1 presents three ways of picturing the same state. A single contour gives the quickest sketch: one imagines a spherical boundary enclosing, for example, 90% of the electron probability. Several contours reveal the graded falloff more honestly. The cloud picture replaces sharp boundaries with a statistical one: imagine recording the electron's position over a great many observations and letting the darker regions mark where detections accumulate. This is the origin of the phrase electron density. It is shorthand for a probability density, not a little pile of substance packed into space.",
          "visuals": [
            {
              "id": "fig-1.1",
              "label": "Figure 1.1",
              "kind": "figure",
              "caption": "Three complementary views of the hydrogen 1s state: a single contour, a richer contour map, and a cloud picture showing where probability accumulates near the nucleus."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.01-p004",
          "text": "[01.01-p004]\nSpherical symmetry makes radial plots especially revealing. Figure 1.2a tracks the fraction of the electron population that lies outside a sphere of radius \\(r\\). The curve falls quickly, which is another way of saying that the 1s state is tightly concentrated near the nucleus. The van der Waals radius, shown near 1.2 Å, belongs to a different order of description. It is not derived from the hydrogen Schrödinger equation. It is an empirical distance extracted from how atoms sit near one another in matter. It is useful, but it does not define the edge of the atom in any deep theoretical sense.",
          "visuals": [
            {
              "id": "fig-1.2",
              "label": "Figure 1.2",
              "kind": "figure",
              "caption": "Two radial views of the hydrogen 1s orbital: one shows how quickly little density survives far from the nucleus, and the other shows where the shell probability is largest."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.01-p005",
          "text": "[01.01-p005]\nFigure 1.2b makes a subtler point. The probability of finding the electron between radii \\(r\\) and \\(r+dr\\) is not controlled by \\(|\\psi(r)|^2\\) alone, but by the volume of the spherical shell, so the radial probability density is proportional to \\(4\\pi r^2 |\\psi(r)|^2\\). The factor \\(r^2\\) grows with distance, while the wavefunction decays with distance; the competition between these two tendencies produces a maximum at \\(a_0 = 0.529\\) Å, the Bohr radius. Thus the wavefunction is largest at the nucleus, yet the most probable radius is not zero. The point is simple but important: probability density at a point and probability in a shell are not the same question.",
          "visuals": [
            {
              "id": "fig-1.2",
              "label": "Figure 1.2",
              "kind": "figure",
              "caption": "The radial probability plot reveals that the most probable radius is the Bohr radius, even though the wavefunction itself is largest at the nucleus."
            }
          ],
          "equations": [],
          "videos": []
        }
      ]
    },
    {
      "id": "01.02",
      "number": "01.02",
      "title": "The First Molecular Orbital: H₂",
      "paragraphs": [
        {
          "id": "01.02-p001",
          "text": "[01.02-p001]\nOnce two hydrogen atoms are brought within bonding distance, the problem changes qualitatively. The system is no longer \"atom 1 plus atom 2\" in any literal sense; it is a new quantum system with two nuclei and two electrons. A full exact solution is already difficult. The first simplifying step is to hold the nuclei at a fixed separation \\(R\\) and ask what one-electron states are available in that fixed two-center field. This clamped-nuclei viewpoint is the opening move behind molecular orbital theory: the nuclei are treated as comparatively slow, the electronic distribution is solved in their presence, and only afterward does one ask how the total energy varies with \\(R\\).",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.02-p002",
          "text": "[01.02-p002]\nThe simplest ansatz is the linear combination of atomic orbitals. One assumes that the new molecular orbital can be approximated by adding the two hydrogen 1s functions:\n\\[\n\\psi = c_1 \\phi_1 + c_2 \\phi_2.\n\\]\nThis is Equation 1.1 in substance. It is not a deduction forced by logic; it is a model choice. One chooses a small basis of plausible functions, here the two 1s orbitals centered on the two nuclei, and asks which linear combinations best adapt to the molecular situation. The coefficients \\(c_1\\) and \\(c_2\\) measure the contribution made by each atomic function. Because the molecule is homonuclear, symmetry demands equal magnitudes, though not necessarily the same sign.",
          "visuals": [],
          "equations": [
            {
              "id": "eq-1.1",
              "label": "1.1",
              "latex": "\\psi = c_1 \\phi_1 + c_2 \\phi_2",
              "spoken": "",
              "note": "The molecular orbital is approximated as a linear combination of the two hydrogen 1s atomic orbitals."
            }
          ],
          "videos": []
        },
        {
          "id": "01.02-p003",
          "text": "[01.02-p003]\nTo see why the signs matter, square the wavefunction:\n\\[\n|\\psi|^2 = (c_1\\phi_1 + c_2\\phi_2)^2\n= (c_1\\phi_1)^2 + (c_2\\phi_2)^2 + 2c_1c_2\\phi_1\\phi_2.\n\\]\nThis is Equation 1.2. The first two terms are what one would have from a mere superposition of separate atomic densities. The decisive new term is the cross term \\(2c_1c_2\\phi_1\\phi_2\\). If it is positive in the internuclear region, electron density accumulates there. If it is negative, density is depleted there. Bonding and antibonding are born from this interference term.",
          "visuals": [],
          "equations": [
            {
              "id": "eq-1.2",
              "label": "1.2",
              "latex": "|\\psi|^2 = (c_1\\phi_1 + c_2\\phi_2)^2 = (c_1\\phi_1)^2 + (c_2\\phi_2)^2 + 2c_1c_2\\phi_1\\phi_2",
              "spoken": "",
              "note": "The cross term explains why the combination can either build up or deplete electron density between the nuclei."
            }
          ],
          "videos": []
        },
        {
          "id": "01.02-p004",
          "text": "[01.02-p004]\nIn the symmetric combination, the two atomic orbitals have the same sign in the region between the nuclei. The cross term is then positive there, so the electron density between the protons increases. That extra negative charge between the nuclei is precisely what screens their mutual repulsion and binds them together. The corresponding molecular orbital is the bonding orbital, written \\(\\sigma\\) for this cylindrically symmetric case. Figure 1.3 depicts it with no node between the nuclei and with an energy lower than that of the isolated 1s orbitals.",
          "visuals": [
            {
              "id": "fig-1.3",
              "label": "Figure 1.3",
              "kind": "figure",
              "caption": "Constructive overlap of the two hydrogen 1s functions yields the lower σ orbital, with enhanced density between the nuclei and no internuclear node."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.02-p005",
          "text": "[01.02-p005]\nIn the antisymmetric combination, the signs oppose one another across the midpoint. The wavefunction must then pass through zero on a plane between the nuclei: a node. Because the wavefunction changes sign there, the electron density in the internuclear region is suppressed. The electrons, if placed in this state, do not help bind the nuclei; they do the opposite, because density is pushed away from the region where it would most effectively hold the protons together. This is the antibonding orbital \\(\\sigma^*\\), shown in Figure 1.3 at higher energy.",
          "visuals": [
            {
              "id": "fig-1.3",
              "label": "Figure 1.3",
              "kind": "figure",
              "caption": "Destructive overlap yields the higher σ* orbital, whose node suppresses density between the nuclei and makes the combination antibonding."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.02-p006",
          "text": "[01.02-p006]\nIn ground-state H₂, two electrons occupy the lower \\(\\sigma\\) orbital with opposite spins. Here one must be a little careful with the familiar chemical phrase \"the orbital is occupied.\" In the underlying theory, one is using an effective one-electron picture and then placing electrons into the resulting states in a way constrained by spin and the Pauli principle. Even at this elementary level, the language is shorthand. Still, it is good shorthand: the lowest available molecular state places electronic density between the nuclei, and that is why the molecule binds.",
          "visuals": [
            {
              "id": "fig-1.3",
              "label": "Figure 1.3",
              "kind": "figure",
              "caption": "In the ground state, both electrons occupy the lower σ orbital, so the internuclear region carries the density that holds the two nuclei together."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.02-p007",
          "text": "[01.02-p007]\nThe strength of this interaction depends on overlap. The overlap integral,\n\\[\nS_{12} = \\int \\phi_1 \\phi_2 \\, d\\tau,\n\\]\nmeasures how much the two atomic orbitals occupy the same region of space. This is Equation 1.3. When the atoms are infinitely far apart, \\(S_{12} = 0\\). If the two 1s functions were brought into exact superposition, \\(S_{12}\\) would rise to 1. Figure 1.4 shows the smooth growth of overlap as the internuclear distance decreases. Overlap alone is not yet energy, but without overlap there is no mixing, and without mixing there is no molecular orbital splitting.",
          "visuals": [
            {
              "id": "fig-1.4",
              "label": "Figure 1.4",
              "kind": "figure",
              "caption": "The overlap integral for two hydrogen 1s orbitals rises as the atoms approach, providing the geometric basis for molecular-orbital splitting."
            }
          ],
          "equations": [
            {
              "id": "eq-1.3",
              "label": "1.3",
              "latex": "S_{12} = \\int \\phi_1 \\phi_2 \\, d\\tau",
              "spoken": "",
              "note": "Equation 1.3 defines the overlap integral, which measures how strongly the two atomic orbitals share the same region of space."
            }
          ],
          "videos": []
        },
        {
          "id": "01.02-p008",
          "text": "[01.02-p008]\nThe energy formulas can be derived directly from the same ansatz. Take the two trial functions \\(\\psi_\\pm = c(\\phi_1 \\pm \\phi_2)\\), where \\(+\\) gives the bonding combination and \\(-\\) the antibonding one. First normalize them. Since \\(\\langle \\phi_1 | \\phi_1 \\rangle = \\langle \\phi_2 | \\phi_2 \\rangle = 1\\) and \\(\\langle \\phi_1 | \\phi_2 \\rangle = S\\),\n\\[\n1 = \\langle \\psi_\\pm | \\psi_\\pm \\rangle = c^2(2 \\pm 2S),\n\\]\nso\n\\[\nc = \\frac{1}{\\sqrt{2(1\\pm S)}}.\n\\]\nNext compute the energy expectation value\n\\[\nE_\\pm = \\frac{\\langle \\psi_\\pm | H | \\psi_\\pm \\rangle}{\\langle \\psi_\\pm | \\psi_\\pm \\rangle}.\n\\]\nBy symmetry, \\(H_{11} = H_{22} = \\alpha\\) and \\(H_{12} = H_{21} = \\beta\\), where\n\\[\n\\alpha = \\int \\phi_1 H \\phi_1 \\, d\\tau, \\qquad \\beta = \\int \\phi_1 H \\phi_2 \\, d\\tau.\n\\]\nSubstituting these matrix elements gives\n\\[\nE_\\pm = \\frac{2\\alpha \\pm 2\\beta}{2(1\\pm S)} = \\frac{\\alpha \\pm \\beta}{1\\pm S}.\n\\]\nThus one recovers Equations 1.4 and 1.5:\n\\[\nE_{\\sigma} = \\frac{\\alpha + \\beta}{1+S}, \\qquad E_{\\sigma^*} = \\frac{\\alpha - \\beta}{1-S}.\n\\]",
          "visuals": [],
          "equations": [
            {
              "id": "eq-1.4",
              "label": "1.4",
              "latex": "E_{\\sigma} = \\frac{\\alpha + \\beta}{1+S}",
              "spoken": "",
              "note": "The bonding one-electron energy in the two-function LCAO model is lowered by the negative interaction term and modified by overlap through the normalization factor."
            },
            {
              "id": "eq-1.5",
              "label": "1.5",
              "latex": "E_{\\sigma^*} = \\frac{\\alpha - \\beta}{1-S}",
              "spoken": "",
              "note": "The antibonding one-electron energy is raised because the sign of the interaction term reverses and the normalization factor now works in the opposite direction."
            }
          ],
          "videos": []
        },
        {
          "id": "01.02-p009",
          "text": "[01.02-p009]\nThe symbols are worth reading slowly. The Hamiltonian \\(H\\) is the energy operator for the electron in the field of the two nuclei. The quantity \\(\\alpha\\) is the Coulomb integral: it is the energy one associates with staying on an atomic-like center. The quantity \\(\\beta\\) is the interaction term that measures how much one center communicates with the other through the Hamiltonian. In this context it is often called a resonance integral, though \"delocalization integral\" would be less misleading, since nothing need literally oscillate. For H₂, \\(\\beta\\) is negative, so \\(\\alpha+\\beta\\) lowers the bonding energy and \\(\\alpha-\\beta\\) raises the antibonding energy. Because \\(S\\) also appears in the denominators, overlap influences the energies twice: once through the explicit matrix coupling and again through normalization.",
          "visuals": [],
          "equations": [
            {
              "id": "eq-1.6",
              "label": "1.6",
              "latex": "\\alpha = \\int \\phi_1 H \\phi_1 \\, d\\tau",
              "spoken": "",
              "note": "The Coulomb integral measures the energy associated with retaining atomic character on one center within the molecular field."
            },
            {
              "id": "eq-1.7",
              "label": "1.7",
              "latex": "\\beta = \\int \\phi_1 H \\phi_2 \\, d\\tau",
              "spoken": "",
              "note": "The interaction integral measures how strongly one atomic function is coupled to the other through the Hamiltonian, giving the basic source of delocalization."
            }
          ],
          "videos": []
        },
        {
          "id": "01.02-p010",
          "text": "[01.02-p010]\nFigure 1.5 turns orbital language into an energy curve. If the bonding orbital is filled, the electronic contribution to the energy falls as the atoms approach: the electrons are increasingly effective at holding the nuclei together. At the same time, the bare Coulomb repulsion between the two positively charged nuclei rises sharply. The actual molecular energy is the sum of these two tendencies. That sum has a minimum at the equilibrium bond length, about 0.75 Å in the schematic plot. A bond exists because attraction wins at intermediate distance but not at very short distance, where nuclear repulsion becomes too strong.",
          "visuals": [
            {
              "id": "fig-1.5",
              "label": "Figure 1.5",
              "kind": "figure",
              "caption": "Electronic attraction competes with nuclear repulsion. For a filled σ orbital the sum develops a minimum at the bond length, producing a stable H₂ molecule."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.02-p011",
          "text": "[01.02-p011]\nIf instead one were to fill the antibonding orbital, the story changes completely. The electronic distribution now fails to accumulate between the nuclei and is pushed outward. The electronic term provides little shielding and soon becomes effectively repulsive. The total energy then rises as the atoms are brought together, so there is no stable minimum. This is the defining mark of an antibonding orbital: if electrons are placed there without adequate compensation from lower bonding orbitals, the nuclei are driven apart.",
          "visuals": [
            {
              "id": "fig-1.5",
              "label": "Figure 1.5",
              "kind": "figure",
              "caption": "If the σ* orbital were filled instead, the total energy would rise as the nuclei approach, so no stable minimum would appear."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.02-p012",
          "text": "[01.02-p012]\nThe formulas also explain why antibonding hurts more than bonding helps. Because the bonding energy is divided by \\(1+S\\) and the antibonding energy by \\(1-S\\), the upward shift of \\(\\sigma^*\\) is larger in magnitude than the downward shift of \\(\\sigma\\). Moreover, two electrons in the same bonding orbital do not give exactly twice the one-electron stabilization, because the electrons still repel one another. The effective picture permits two opposite-spin electrons to share the orbital, but not to escape Coulomb repulsion. That is why the stabilization of H₂ is more modest than a naive doubling would suggest, and it is also why He₂ does not bind in this simple scheme: two electrons would fill \\(\\sigma\\), two would fill \\(\\sigma^*\\), and the antibonding penalty slightly outweighs the bonding gain.",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.02-p013",
          "text": "[01.02-p013]\nThis brings in electron correlation. Even when two electrons occupy the same spatial orbital, they do not literally sit on top of one another. Their motions become correlated: when one is more to one side, the other tends, on average, to avoid it. Basic molecular orbital treatments include the mean repulsion only in an averaged way. More refined methods try to capture the residual avoidance more faithfully. When one adds mixtures of more than one electronic configuration in order to improve that description, the refinement is called configuration interaction. In the present discussion the point is modest but important: the simplest orbital picture is already illuminating, but it is still an approximation.",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.02-p014",
          "text": "[01.02-p014]\nFigures 1.6 and 1.7 give a more exact visual sense of what the bonding and antibonding states do to the electron distribution. In the bonding orbital, contours bend inward and the density along the internuclear axis rises above the simple sum of the two isolated atomic densities. In the antibonding orbital, the midpoint is depleted and density is pushed outward, especially on the far sides of the nuclei. The node is not merely a decorative feature of the drawing. It is the geometric sign that the wavefunction has been forced into destructive interference where bonding would otherwise occur.",
          "visuals": [
            {
              "id": "fig-1.6",
              "label": "Figure 1.6",
              "kind": "figure",
              "caption": "Contour slices through the H₂ molecular orbitals show inward concentration for σ and a nodal separation with outward displacement for σ*."
            },
            {
              "id": "fig-1.7",
              "label": "Figure 1.7",
              "kind": "figure",
              "caption": "Plots of the squared wavefunction along the bond axis reveal enhanced midpoint density for σ and depleted midpoint density for σ* relative to the separate-atom reference."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.02-p015",
          "text": "[01.02-p015]\nThe coefficients can also be normalized explicitly. In the crude approximation that neglects overlap in the normalization step, symmetry gives \\(|c_1| = |c_2|\\) and \\(c_1^2 + c_2^2 = 1\\), so each coefficient has magnitude \\(1/\\sqrt{2} \\approx 0.707\\). Thus the bonding orbital has coefficients \\((0.707, 0.707)\\) and the antibonding orbital \\((0.707, -0.707)\\), up to an overall sign. A fuller normalization keeps \\(S\\) and makes the antibonding coefficients slightly larger in magnitude than the bonding ones. That small correction is another reflection of the same asymmetry already visible in the energy formulas: antibonding is a little more severe than bonding is generous.",
          "visuals": [],
          "equations": [],
          "videos": []
        }
      ]
    }
  ],
  "stats": {
    "sectionCount": 2,
    "paragraphCount": 20,
    "visualCount": 11,
    "equationCount": 7
  }
};
