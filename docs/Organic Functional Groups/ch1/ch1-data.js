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
          "text": "The simplest bond is the bond between two hydrogen atoms, and so the natural entrance into molecular orbital theory is to understand one hydrogen atom with some care. A hydrogen atom contains one proton and one electron. The central object is therefore the electron wavefunction \\(\\psi(\\mathbf{r})\\), not because the electron is a mist in any naive pictorial sense, but because quantum mechanics encodes the spatial state of the electron in that function. The measurable quantity is \\(|\\psi|^2\\), and the probability of finding the electron in a tiny volume element \\(d\\tau\\) is \\(|\\psi|^2 d\\tau\\). Normalization requires\n\\[\n\\int |\\psi|^2\\, d\\tau = 1.\n\\]\nThe wavefunction itself may be positive, negative, or even complex; only after squaring its modulus does one obtain a probability distribution.",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.01-p002",
          "text": "For the hydrogen ground state the relevant orbital is the 1s orbital. It is spherically symmetric, so no direction in space is privileged. The amplitude is largest at the nucleus and then falls away rapidly with distance. This decay is so strong that about 90% of the electron probability lies within 1.4 Å of the nucleus, and more than 99% within 2 Å. The ground-state electron is bound by 13.60 eV relative to a completely separated proton and electron. Already one sees an important habit of thought: an orbital is not a little path, but a stationary distribution whose energetic meaning is inseparable from its shape.",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.01-p003",
          "text": "Figure 1.1 presents three ways of picturing the same state. A single contour gives the quickest sketch: one imagines a spherical boundary enclosing, for example, 90% of the electron probability. Several contours reveal the graded falloff more honestly. The cloud picture replaces sharp boundaries with a statistical one: imagine recording the electron's position over a great many observations and letting the darker regions mark where detections accumulate. This is the origin of the phrase electron density. It is shorthand for a probability density, not a little pile of substance packed into space.",
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
          "text": "Spherical symmetry makes radial plots especially revealing. Figure 1.2a tracks the fraction of the electron population that lies outside a sphere of radius \\(r\\). The curve falls quickly, which is another way of saying that the 1s state is tightly concentrated near the nucleus. The van der Waals radius, shown near 1.2 Å, belongs to a different order of description. It is not derived from the hydrogen Schrödinger equation. It is an empirical distance extracted from how atoms sit near one another in matter. It is useful, but it does not define the edge of the atom in any deep theoretical sense.",
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
          "text": "Figure 1.2b makes a subtler point. The probability of finding the electron between radii \\(r\\) and \\(r+dr\\) is not controlled by \\(|\\psi(r)|^2\\) alone, but by the volume of the spherical shell, so the radial probability density is proportional to \\(4\\pi r^2 |\\psi(r)|^2\\). The factor \\(r^2\\) grows with distance, while the wavefunction decays with distance; the competition between these two tendencies produces a maximum at \\(a_0 = 0.529\\) Å, the Bohr radius. Thus the wavefunction is largest at the nucleus, yet the most probable radius is not zero. The point is simple but important: probability density at a point and probability in a shell are not the same question.",
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
          "text": "Once two hydrogen atoms are brought within bonding distance, the problem changes qualitatively. The system is no longer \"atom 1 plus atom 2\" in any literal sense; it is a new quantum system with two nuclei and two electrons. A full exact solution is already difficult. The first simplifying step is to hold the nuclei at a fixed separation \\(R\\) and ask what one-electron states are available in that fixed two-center field. This clamped-nuclei viewpoint is the opening move behind molecular orbital theory: the nuclei are treated as comparatively slow, the electronic distribution is solved in their presence, and only afterward does one ask how the total energy varies with \\(R\\).",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.02-p002",
          "text": "The simplest ansatz is the linear combination of atomic orbitals. One assumes that the new molecular orbital can be approximated by adding the two hydrogen 1s functions:\n\\[\n\\psi = c_1 \\phi_1 + c_2 \\phi_2.\n\\]\nThis is Equation 1.1 in substance. It is not a deduction forced by logic; it is a model choice. One chooses a small basis of plausible functions, here the two 1s orbitals centered on the two nuclei, and asks which linear combinations best adapt to the molecular situation. The coefficients \\(c_1\\) and \\(c_2\\) measure the contribution made by each atomic function. Because the molecule is homonuclear, symmetry demands equal magnitudes, though not necessarily the same sign.",
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
          "text": "To see why the signs matter, square the wavefunction:\n\\[\n|\\psi|^2 = (c_1\\phi_1 + c_2\\phi_2)^2\n= (c_1\\phi_1)^2 + (c_2\\phi_2)^2 + 2c_1c_2\\phi_1\\phi_2.\n\\]\nThis is Equation 1.2. The first two terms are what one would have from a mere superposition of separate atomic densities. The decisive new term is the cross term \\(2c_1c_2\\phi_1\\phi_2\\). If it is positive in the internuclear region, electron density accumulates there. If it is negative, density is depleted there. Bonding and antibonding are born from this interference term.",
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
          "text": "In the symmetric combination, the two atomic orbitals have the same sign in the region between the nuclei. The cross term is then positive there, so the electron density between the protons increases. That extra negative charge between the nuclei is precisely what screens their mutual repulsion and binds them together. The corresponding molecular orbital is the bonding orbital, written \\(\\sigma\\) for this cylindrically symmetric case. Figure 1.3 depicts it with no node between the nuclei and with an energy lower than that of the isolated 1s orbitals.",
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
          "text": "In the antisymmetric combination, the signs oppose one another across the midpoint. The wavefunction must then pass through zero on a plane between the nuclei: a node. Because the wavefunction changes sign there, the electron density in the internuclear region is suppressed. The electrons, if placed in this state, do not help bind the nuclei; they do the opposite, because density is pushed away from the region where it would most effectively hold the protons together. This is the antibonding orbital \\(\\sigma^*\\), shown in Figure 1.3 at higher energy.",
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
          "text": "In ground-state H₂, two electrons occupy the lower \\(\\sigma\\) orbital with opposite spins. Here one must be a little careful with the familiar chemical phrase \"the orbital is occupied.\" In the underlying theory, one is using an effective one-electron picture and then placing electrons into the resulting states in a way constrained by spin and the Pauli principle. Even at this elementary level, the language is shorthand. Still, it is good shorthand: the lowest available molecular state places electronic density between the nuclei, and that is why the molecule binds.",
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
          "text": "The strength of this interaction depends on overlap. The overlap integral,\n\\[\nS_{12} = \\int \\phi_1 \\phi_2 \\, d\\tau,\n\\]\nmeasures how much the two atomic orbitals occupy the same region of space. This is Equation 1.3. When the atoms are infinitely far apart, \\(S_{12} = 0\\). If the two 1s functions were brought into exact superposition, \\(S_{12}\\) would rise to 1. Figure 1.4 shows the smooth growth of overlap as the internuclear distance decreases. Overlap alone is not yet energy, but without overlap there is no mixing, and without mixing there is no molecular orbital splitting.",
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
          "text": "The energy formulas can be derived directly from the same ansatz. Take the two trial functions \\(\\psi_\\pm = c(\\phi_1 \\pm \\phi_2)\\), where \\(+\\) gives the bonding combination and \\(-\\) the antibonding one. First normalize them. Since \\(\\langle \\phi_1 | \\phi_1 \\rangle = \\langle \\phi_2 | \\phi_2 \\rangle = 1\\) and \\(\\langle \\phi_1 | \\phi_2 \\rangle = S\\),\n\\[\n1 = \\langle \\psi_\\pm | \\psi_\\pm \\rangle = c^2(2 \\pm 2S),\n\\]\nso\n\\[\nc = \\frac{1}{\\sqrt{2(1\\pm S)}}.\n\\]\nNext compute the energy expectation value\n\\[\nE_\\pm = \\frac{\\langle \\psi_\\pm | H | \\psi_\\pm \\rangle}{\\langle \\psi_\\pm | \\psi_\\pm \\rangle}.\n\\]\nBy symmetry, \\(H_{11} = H_{22} = \\alpha\\) and \\(H_{12} = H_{21} = \\beta\\), where\n\\[\n\\alpha = \\int \\phi_1 H \\phi_1 \\, d\\tau, \\qquad \\beta = \\int \\phi_1 H \\phi_2 \\, d\\tau.\n\\]\nSubstituting these matrix elements gives\n\\[\nE_\\pm = \\frac{2\\alpha \\pm 2\\beta}{2(1\\pm S)} = \\frac{\\alpha \\pm \\beta}{1\\pm S}.\n\\]\nThus one recovers Equations 1.4 and 1.5:\n\\[\nE_{\\sigma} = \\frac{\\alpha + \\beta}{1+S}, \\qquad E_{\\sigma^*} = \\frac{\\alpha - \\beta}{1-S}.\n\\]",
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
          "text": "The symbols are worth reading slowly. The Hamiltonian \\(H\\) is the energy operator for the electron in the field of the two nuclei. The quantity \\(\\alpha\\) is the Coulomb integral: it is the energy one associates with staying on an atomic-like center. The quantity \\(\\beta\\) is the interaction term that measures how much one center communicates with the other through the Hamiltonian. In this context it is often called a resonance integral, though \"delocalization integral\" would be less misleading, since nothing need literally oscillate. For H₂, \\(\\beta\\) is negative, so \\(\\alpha+\\beta\\) lowers the bonding energy and \\(\\alpha-\\beta\\) raises the antibonding energy. Because \\(S\\) also appears in the denominators, overlap influences the energies twice: once through the explicit matrix coupling and again through normalization.",
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
          "text": "Figure 1.5 turns orbital language into an energy curve. If the bonding orbital is filled, the electronic contribution to the energy falls as the atoms approach: the electrons are increasingly effective at holding the nuclei together. At the same time, the bare Coulomb repulsion between the two positively charged nuclei rises sharply. The actual molecular energy is the sum of these two tendencies. That sum has a minimum at the equilibrium bond length, about 0.75 Å in the schematic plot. A bond exists because attraction wins at intermediate distance but not at very short distance, where nuclear repulsion becomes too strong.",
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
          "text": "If instead one were to fill the antibonding orbital, the story changes completely. The electronic distribution now fails to accumulate between the nuclei and is pushed outward. The electronic term provides little shielding and soon becomes effectively repulsive. The total energy then rises as the atoms are brought together, so there is no stable minimum. This is the defining mark of an antibonding orbital: if electrons are placed there without adequate compensation from lower bonding orbitals, the nuclei are driven apart.",
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
          "text": "The formulas also explain why antibonding hurts more than bonding helps. Because the bonding energy is divided by \\(1+S\\) and the antibonding energy by \\(1-S\\), the upward shift of \\(\\sigma^*\\) is larger in magnitude than the downward shift of \\(\\sigma\\). Moreover, two electrons in the same bonding orbital do not give exactly twice the one-electron stabilization, because the electrons still repel one another. The effective picture permits two opposite-spin electrons to share the orbital, but not to escape Coulomb repulsion. That is why the stabilization of H₂ is more modest than a naive doubling would suggest, and it is also why He₂ does not bind in this simple scheme: two electrons would fill \\(\\sigma\\), two would fill \\(\\sigma^*\\), and the antibonding penalty slightly outweighs the bonding gain.",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.02-p013",
          "text": "This brings in electron correlation. Even when two electrons occupy the same spatial orbital, they do not literally sit on top of one another. Their motions become correlated: when one is more to one side, the other tends, on average, to avoid it. Basic molecular orbital treatments include the mean repulsion only in an averaged way. More refined methods try to capture the residual avoidance more faithfully. When one adds mixtures of more than one electronic configuration in order to improve that description, the refinement is called configuration interaction. In the present discussion the point is modest but important: the simplest orbital picture is already illuminating, but it is still an approximation.",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.02-p014",
          "text": "Figures 1.6 and 1.7 give a more exact visual sense of what the bonding and antibonding states do to the electron distribution. In the bonding orbital, contours bend inward and the density along the internuclear axis rises above the simple sum of the two isolated atomic densities. In the antibonding orbital, the midpoint is depleted and density is pushed outward, especially on the far sides of the nuclei. The node is not merely a decorative feature of the drawing. It is the geometric sign that the wavefunction has been forced into destructive interference where bonding would otherwise occur.",
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
          "text": "The coefficients can also be normalized explicitly. In the crude approximation that neglects overlap in the normalization step, symmetry gives \\(|c_1| = |c_2|\\) and \\(c_1^2 + c_2^2 = 1\\), so each coefficient has magnitude \\(1/\\sqrt{2} \\approx 0.707\\). Thus the bonding orbital has coefficients \\((0.707, 0.707)\\) and the antibonding orbital \\((0.707, -0.707)\\), up to an overall sign. A fuller normalization keeps \\(S\\) and makes the antibonding coefficients slightly larger in magnitude than the bonding ones. That small correction is another reflection of the same asymmetry already visible in the energy formulas: antibonding is a little more severe than bonding is generous.",
          "visuals": [],
          "equations": [],
          "videos": []
        }
      ]
    },
    {
      "id": "01.03",
      "number": "01.03",
      "title": "Three and Four Hydrogen Assemblies",
      "paragraphs": [
        {
          "id": "01.03-p001",
          "text": "Once a third hydrogen atom is brought into the picture, the two-center story is no longer enough. For triangular H₃ one convenient way to proceed is to take an H₂ fragment first, with its bonding \\(\\sigma\\) and antibonding \\(\\sigma^*\\) orbitals, and then ask how the 1s orbital on the third atom can mix with those two molecular orbitals. This is the first moment at which symmetry ceases to be a decorative afterthought and becomes an actual selection rule. With three centers present, one cannot simply allow every orbital to interact with every other. Most apparent possibilities are forbidden by symmetry before one writes down any serious numerical calculation.",
          "visuals": [
            {
              "id": "fig-1.8",
              "label": "Figure 1.8",
              "kind": "figure",
              "caption": "Triangular H₃ is built by combining a third hydrogen 1s orbital with the bonding and antibonding orbitals of an H₂ fragment."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.03-p002",
          "text": "The reason is straightforward. If a molecular framework has a symmetry plane, then an orbital may be either symmetric or antisymmetric with respect to reflection in that plane. In the triangular arrangement of Fig. 1.8, the nontrivial plane is the yz plane. The H₂ bonding orbital \\(\\sigma\\) and the third hydrogen 1s orbital are both symmetric with respect to that reflection, whereas the antibonding orbital \\(\\sigma^*\\) is antisymmetric. When one evaluates a coupling matrix element, the integral vanishes whenever the integrand changes sign under the symmetry operation. In compact form,\n\\[\n\\langle \\phi_a | H | \\phi_b \\rangle = \\int \\phi_a\\, H\\, \\phi_b \\, d\\tau = 0\n\\]\nif one factor is symmetric and the other antisymmetric with respect to the same symmetry element. This is why only orbitals of the same symmetry can mix.",
          "visuals": [
            {
              "id": "fig-1.8",
              "label": "Figure 1.8",
              "kind": "figure",
              "caption": "The yz mirror plane separates the orbitals into symmetric and antisymmetric types, and only like symmetry types can couple."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.03-p003",
          "text": "Accordingly, the symmetric pair — the H₂ bonding orbital and the third 1s orbital — combine to produce two new orbitals, labelled \\(\\sigma_1\\) and \\(\\sigma_2^*\\) in Fig. 1.8. The lower one is bonding because all three contributions cooperate in phase, so electronic density is built up in the regions that hold the nuclei together. The upper one is antibonding overall: it contains a node that frustrates one part of the three-center bonding pattern, leaving two antibonding interactions against only one bonding interaction. The antisymmetric \\(\\sigma^*\\) orbital of the original H₂ fragment remains essentially unchanged, not because nature has forgotten it, but because there is nothing of the correct symmetry available for it to mix with.",
          "visuals": [
            {
              "id": "fig-1.8",
              "label": "Figure 1.8",
              "kind": "figure",
              "caption": "The symmetric pair produces a lower three-center bonding orbital and a higher antibonding one, while the antisymmetric H₂ orbital remains essentially nonbonding."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.03-p004",
          "text": "Only after the orbitals are constructed is it sensible to place electrons into them. That is the content of the aufbau viewpoint used here: first determine the available molecular orbitals, then fill them from low to high energy. With two electrons, as in \\(\\mathrm{H}_3^+\\), both electrons enter \\(\\sigma_1\\), and the three-center system is electronically stabilized. With three electrons, as in neutral \\(\\mathrm{H}_3^\\bullet\\), the third electron must enter an antibonding level, but the net result is still stabilizing because the lower bonding orbital contains two electrons while the higher level contains only one. With four electrons, as in \\(\\mathrm{H}_3^-\\), the antibonding contribution outweighs the bonding gain, and the assembly is no longer electronically favorable.",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.03-p005",
          "text": "The same symmetry logic survives if the three atoms are arranged linearly instead of triangularly. Figure 1.9 shows that the ordering remains similar, because the symmetry labels do not change, but the quantitative balance does. In the triangular case the two lower hydrogen atoms also overlap with each other, so both the bonding and antibonding effects are stronger. In the linear case that side-by-side overlap is removed. The lowest orbital is therefore less strongly stabilized, the upper antibonding orbital is less strongly destabilized, and the untouched antisymmetric orbital moves closer to the energy of an isolated 1s function. Geometry does not abolish the symmetry argument; it modulates the strength of the allowed interactions.",
          "visuals": [
            {
              "id": "fig-1.9",
              "label": "Figure 1.9",
              "kind": "figure",
              "caption": "Linear H₃ keeps the same symmetry logic as triangular H₃, but weaker overlap changes the size of the bonding and antibonding splittings."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.03-p006",
          "text": "Four hydrogen atoms make the same lesson even sharper. In the tetrahedral H₄ arrangement of Fig. 1.10, it is convenient to start from two H₂ fragments at right angles to one another and classify their orbitals with respect to the two mirror planes xz and yz. The bonding orbital on one fragment is symmetric with respect to both planes, so it carries the label SS. The corresponding antibonding orbital is symmetric with respect to one plane and antisymmetric with respect to the other, giving SA or AS depending on orientation. Only orbitals with the same double symmetry label can interact. As a result, the two SS bonding orbitals mix with each other, while the two antibonding fragment orbitals of mismatched symmetry do not.",
          "visuals": [
            {
              "id": "fig-1.10",
              "label": "Figure 1.10",
              "kind": "figure",
              "caption": "Tetrahedral H₄ is analyzed by combining two H₂ fragments and classifying their orbitals by double symmetry labels with respect to the xz and yz planes."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.03-p007",
          "text": "This gives one lower SS combination and one higher SS combination, often written \\(\\sigma_1\\) and \\(\\sigma_2^*\\), together with two largely unchanged antibonding fragment orbitals. Because the weight is now spread over four centers, equal-amplitude coefficients in the fully delocalized combination are of order \\(1/2\\) rather than \\(1/\\sqrt{2}\\). The normalization condition\n\\[\n\\sum_i c_i^2 = 1\n\\]\nmakes that inevitable. The higher SS combination contains more antibonding contacts than bonding ones, but each individual contact is weaker because the coefficients are smaller. That is why its energy can sit near the energies of the unchanged antibonding fragment orbitals instead of shooting far above them.",
          "visuals": [
            {
              "id": "fig-1.10",
              "label": "Figure 1.10",
              "kind": "figure",
              "caption": "The delocalized four-center combinations carry smaller coefficients on each atom, so even the higher SS combination is not destabilized as violently as a two-center antibonding orbital."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.03-p008",
          "text": "The decisive chemical point is what happens when four electrons occupy the system. Each H₂ fragment already contributes a filled bonding orbital. When two filled bonding orbitals are brought together, the interaction produces one lower and one higher combination, but both are occupied. The stabilization gained by the lower one is then offset, and more than offset, by the destabilization of the higher one. Hence two H₂ molecules do not merge into a stable H₄ molecule. This is not a curious accident of one geometry. It is the elementary prototype of a much broader truth: when closed-shell molecules approach one another, filled-filled orbital interactions are usually repulsive. Chemical reaction requires some way of overcoming that repulsion, and a large part of activation energy is nothing other than the energetic price of forcing molecules close enough for new interactions to replace the old ones.",
          "visuals": [
            {
              "id": "fig-1.10",
              "label": "Figure 1.10",
              "kind": "figure",
              "caption": "When both fragment bonding orbitals are filled, the interaction of the two H₂ molecules is overall repulsive rather than stabilizing."
            }
          ],
          "equations": [],
          "videos": []
        }
      ]
    },
    {
      "id": "01.04",
      "number": "01.04",
      "title": "Carbon Atomic Orbitals and Orbital Overlap",
      "paragraphs": [
        {
          "id": "01.04-p001",
          "text": "To move from hydrogen to ordinary organic bonding, one must first understand the valence orbitals of carbon. The carbon 1s orbital is too low in energy and too tightly contracted to contribute meaningfully to normal covalent bonding, so it functions as a core shell whose main role is to shield the nucleus. The orbitals that matter chemically are the valence 2s and 2p orbitals. The 2s orbital is still spherically symmetric, but unlike hydrogen 1s it contains a spherical node: the radial wavefunction changes sign once as one moves outward from the nucleus. Even so, the inner lobe is so compact that chemically important overlap comes almost entirely from the outer lobe, which is why the 2s orbital is often drawn as a simple sphere in practical orbital diagrams. Figure 1.11 shows the more honest wavefunction and contour picture behind that simplification.",
          "visuals": [
            {
              "id": "fig-1.11",
              "label": "Figure 1.11",
              "kind": "figure",
              "caption": "Carbon 2s has a radial node, but chemically relevant overlap comes mainly from the outer lobe, so the orbital is often drawn as a simple sphere."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.04-p002",
          "text": "Its energy, about \\(-19.5\\) eV in the discussion here, is markedly lower than that of hydrogen 1s. The deeper energy reflects the stronger pull of a six-proton nucleus, partially softened by shielding from the other electrons and by the fact that valence electrons spend much of their time farther from the nucleus. Slater-style effective-charge reasoning makes this plausible without pretending to be exact: the core 1s electrons screen strongly, the other valence electrons screen more weakly, and the resulting effective nuclear charge still binds the 2s electrons much more tightly than hydrogen binds its single 1s electron.",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.04-p003",
          "text": "The three 2p orbitals are altogether different in shape. They point along three mutually perpendicular axes and each contains a nodal plane passing through the nucleus. Figure 1.12 shows the \\(2p_x\\) orbital explicitly: two lobes of opposite sign extend on either side of the nucleus, and the wavefunction crosses through zero at the center. The three 2p orbitals are higher in energy than 2s, here about \\(-10.7\\) eV, because they keep their electron density on average farther from the nucleus. Yet if one squares all three p orbitals and adds the resulting densities, the total has spherical symmetry again. The directional character belongs to each individual orbital, not to the sum of a filled p shell.",
          "visuals": [
            {
              "id": "fig-1.12",
              "label": "Figure 1.12",
              "kind": "figure",
              "caption": "Each carbon 2p orbital has two lobes of opposite sign separated by a nodal plane, and the three together point along mutually perpendicular axes."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.04-p004",
          "text": "Bonding to carbon can therefore arise in three basic ways: s-s overlap, s-p overlap, and p-p overlap. The first is already familiar from H₂. The new subtleties lie in the second and third, because the sign structure of p orbitals makes the overlap strongly dependent on geometry. When a hydrogen 1s orbital approaches a carbon p orbital head-on along the p axis, with the near lobe of matching sign, the overlap integral grows as the orbitals begin to interpenetrate, reaches a maximum at a finite separation, and then falls again if the nuclei are forced too close. The fall is not mysterious. Once the hydrogen 1s function begins to overlap appreciably with the far lobe of opposite sign, bonding and antibonding contributions cancel. Figure 1.13a makes this cancellation visible.",
          "visuals": [
            {
              "id": "fig-1.13",
              "label": "Figure 1.13",
              "kind": "figure",
              "caption": "Head-on s-p overlap first grows, then weakens when overlap with the far lobe of opposite sign begins to cancel the bonding contribution."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.04-p005",
          "text": "The same logic governs head-on p-p overlap. With matching signs on the approaching lobes, the overlap first increases as the lobes meet, reaches a maximum at an appropriate bond length, and then decreases when the front-lobe overlap is increasingly cancelled by overlap involving the back lobes. Figure 1.13b shows that even a seemingly simple \\(\\sigma\\) overlap between two p orbitals is not monotone all the way to superposition. A p orbital is not a little arrow that simply \"points and bonds.\" Its positive and negative lobes impose a geometry-sensitive interference pattern, and the overlap integral records that pattern quantitatively.",
          "visuals": [
            {
              "id": "fig-1.13",
              "label": "Figure 1.13",
              "kind": "figure",
              "caption": "Head-on p-p overlap also has an optimum distance: too much interpenetration forces cancellation between positive and negative lobes."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.04-p006",
          "text": "Imperfect alignment weakens the interaction for the same structural reason. Bonding is strongest when extra electron density is built up directly between the nuclei, because that is the position from which the negative charge best screens nuclear repulsion. If the overlap region is off-axis, the density increase is both smaller and less well placed. For a hydrogen 1s orbital approaching a carbon 2p orbital, the overlap varies as the cosine of the angle of approach:\n\\[\nS \\propto \\cos\\theta.\n\\]\nAt \\(\\theta = 0^\\circ\\) the approach is perfectly head-on and the overlap is maximal; at \\(90^\\circ\\) the hydrogen lies in the nodal plane and the overlap vanishes. This is the first rigorous glimpse of why orbital orientation matters so much in organic structure. Directionality is not an extra rule pasted onto bonding. It is already built into the wavefunctions.",
          "visuals": [
            {
              "id": "fig-1.13",
              "label": "Figure 1.13",
              "kind": "figure",
              "caption": "Tilting the approach weakens overlap, and for a hydrogen 1s orbital approaching a carbon 2p orbital the strength falls with the cosine of the approach angle."
            }
          ],
          "equations": [],
          "videos": []
        }
      ]
    },
    {
      "id": "01.05",
      "number": "01.05",
      "title": "Methane",
      "paragraphs": [
        {
          "id": "01.05-p001",
          "text": "Methane is the first carbon compound in which all these pieces lock together. There are eight valence electrons altogether, four from carbon and one from each hydrogen, so four filled bonding molecular orbitals are required. The hydrogen atoms repel one another, and the arrangement that separates them most effectively is the tetrahedral one. That geometry is not chosen merely to keep the hydrogens apart. It also allows symmetry-adapted combinations of the four hydrogen 1s orbitals to match the available carbon valence orbitals in just the right way, so that all four electron pairs can be accommodated in bonding orbitals.",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.05-p002",
          "text": "A useful route is to begin with the symmetry-adapted combinations already suggested by tetrahedral H₄. Relative to the xz and yz mirror planes used in Fig. 1.14, the four hydrogen combinations have symmetries SS, SS, SA, and AS. The carbon valence orbitals provide exactly the needed partners: the 2s orbital is SS, and the three 2p orbitals furnish one orbital of each of the remaining symmetry types together with an additional SS combination. The rule is the same as before and is now decisive: only orbitals of the same symmetry can mix. Methane bonding is therefore not assembled by pairing each hydrogen with one private carbon orbital. It is assembled by matching whole symmetry types across the entire molecule.",
          "visuals": [
            {
              "id": "fig-1.14",
              "label": "Figure 1.14",
              "kind": "figure",
              "caption": "Methane is assembled by matching the symmetry-adapted hydrogen combinations with carbon 2s and 2p orbitals of the same symmetry type."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.05-p003",
          "text": "One subtlety matters. Although there are two SS orbitals on the hydrogen side and two on the carbon side, not every formal SS-SS pairing leads to real interaction. The overlap between carbon 2s and the higher hydrogen SS combination \\(\\sigma_2^*\\) is zero, because positive overlap in one region is cancelled by negative overlap in another. Symmetry allows the interaction in principle, but the spatial pattern kills it in practice. What survives is four genuine bonding combinations and, higher in energy, four corresponding antibonding combinations. One of the bonding orbitals lies lower than the other three because it draws more strongly on the lower-energy carbon 2s orbital. The other three are equal in energy because they arise from symmetry-equivalent interactions involving the three carbon 2p orbitals. Figure 1.14 lays out this structure cleanly.",
          "visuals": [
            {
              "id": "fig-1.14",
              "label": "Figure 1.14",
              "kind": "figure",
              "caption": "Four bonding methane orbitals survive after symmetry matching and cancellation are taken into account; the corresponding antibonding set lies higher in energy."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.05-p004",
          "text": "This picture also corrects a very common oversimplification. No single filled molecular orbital is \"the bond\" to one particular hydrogen. Each C-H bond is supported by several molecular orbitals at once. Some hydrogen atoms receive density from the totally symmetric low-lying orbital and from one or two of the p-derived orbitals, while a different p-derived orbital may vanish on them because they lie in one of its nodal planes. Thus bonding is distributed across the whole set of occupied orbitals. Localized bond language is often convenient later, but the underlying molecular-orbital description is collective from the outset.",
          "visuals": [
            {
              "id": "fig-1.14",
              "label": "Figure 1.14",
              "kind": "figure",
              "caption": "Each C-H bond is supported by several occupied molecular orbitals; no single orbital belongs exclusively to one hydrogen atom."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.05-p005",
          "text": "Figure 1.15 gives the more realistic contour picture. The four occupied methane orbitals are shown as surfaces of constant wavefunction, with shading marking sign. These are not little sticks connecting carbon to hydrogen. They are extended wave patterns whose shapes still betray their ancestry: one strongly s-like totally symmetric orbital and three mutually related orbitals with clear p character. The conventional drawings of Fig. 1.14 are therefore useful for bookkeeping which atomic orbitals contribute, while the contour surfaces show more honestly what the resulting electron distribution looks like in space. Between them one learns the right lesson: methane is held together by symmetry-matched delocalized orbitals built from carbon 2s and 2p functions together with the four hydrogen 1s functions.",
          "visuals": [
            {
              "id": "fig-1.15",
              "label": "Figure 1.15",
              "kind": "figure",
              "caption": "Contour surfaces for the four occupied methane orbitals reveal their extended wave character more honestly than stick-like conventional sketches."
            }
          ],
          "equations": [],
          "videos": []
        }
      ]
    },
    {
      "id": "01.06",
      "number": "01.06",
      "title": "Methylene",
      "paragraphs": [
        {
          "id": "01.06-p001",
          "text": "Methylene, \\(\\mathrm{CH_2}\\), is a useful test case because it is smaller than methane and yet more revealing. It is not a quiet closed-shell molecule like methane, but a reactive intermediate, and its lowest-energy structure is bent rather than linear. The reason is already visible at the level of orbital interaction. One may begin with an \\(\\mathrm{H_2}\\) fragment on one side and the valence orbitals of carbon on the other, as in Figure 1.16. The hydrogen fragment contributes a bonding orbital \\(\\sigma_{\\mathrm{HH}}\\) and an antibonding orbital \\(\\sigma_{\\mathrm{HH}}^*\\). Carbon contributes \\(2s\\), \\(2p_x\\), \\(2p_y\\), and \\(2p_z\\). The important step is to classify all of them with respect to the symmetry elements of the bent \\(\\mathrm{H\\!-\\!C\\!-\\!H}\\) arrangement.",
          "visuals": [
            {
              "id": "fig-1.16",
              "label": "Figure 1.16",
              "kind": "figure",
              "caption": "Methylene is analyzed by combining the bonding and antibonding orbitals of an H₂ fragment with the valence orbitals of carbon."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.06-p002",
          "text": "There are three such symmetry operations in the chosen orientation: the \\(xz\\) plane containing all three atoms, the \\(yz\\) plane bisecting the molecule and exchanging the two hydrogens, and a twofold rotation about the \\(z\\) axis. With respect to these, \\(\\sigma_{\\mathrm{HH}}\\) is of \\(SSS\\) type and \\(\\sigma_{\\mathrm{HH}}^*\\) is of \\(SAA\\) type. On carbon, the \\(2s\\) and \\(2p_z\\) orbitals are both \\(SSS\\), \\(2p_x\\) is \\(SAA\\), and \\(2p_y\\) is \\(ASA\\). The selection rule is therefore immediate. The antibonding hydrogen combination can mix only with \\(2p_x\\). The \\(2p_y\\) orbital has no partner of matching symmetry and remains nonbonding. The more interesting sector is the \\(SSS\\) one, because three orbitals now share the same symmetry and must be combined together rather than in pairs.",
          "visuals": [
            {
              "id": "fig-1.16",
              "label": "Figure 1.16",
              "kind": "figure",
              "caption": "The bent H–C–H geometry is sorted by three symmetry operations, and those symmetry labels decide which orbitals may mix."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.06-p003",
          "text": "The corresponding linear combination is\n\\[\n\\psi = c_1 \\phi_1 + c_2 \\phi_2 + c_3 \\phi_3,\n\\]\nwhich is Equation 1.8 in substance. Here the three basis functions may be taken as \\(\\sigma_{\\mathrm{HH}}\\), carbon \\(2s\\), and carbon \\(2p_z\\). Symmetry forces \\(|c_1| = |c_3|\\) only when the outer contributions are symmetry-related; the central carbon coefficient may differ. Because the carbon \\(2s\\) orbital begins lower in energy than the hydrogen combination, the lowest orbital that emerges from this three-way mixing is largely s-like and is labelled \\(\\sigma_s\\) in Figures 1.16 and 1.17. The next one, \\(\\sigma_z\\), carries much more \\(2p_z\\) character: it bulges above and below carbon in the plane of the molecule and contributes decisively to the bent geometry. A third orbital, higher in energy and antibonding overall, contains the same ingredients out of phase and is the price paid for allowing the lower two to form.",
          "visuals": [
            {
              "id": "fig-1.17",
              "label": "Figure 1.17",
              "kind": "figure",
              "caption": "Three orbitals of the same symmetry combine to give a low mostly s-like orbital, a higher p-rich bonding orbital, and a still higher antibonding partner."
            }
          ],
          "equations": [
            {
              "id": "eq-1.8",
              "label": "1.8",
              "latex": "\\psi = c_1 \\phi_1 + c_2 \\phi_2 + c_3 \\phi_3",
              "spoken": "",
              "note": "Equation 1.8 is the three-term LCAO ansatz used when three basis functions of the same symmetry are allowed to interact."
            }
          ],
          "videos": []
        },
        {
          "id": "01.06-p004",
          "text": "The second allowed interaction is simpler. The \\(SAA\\) hydrogen orbital \\(\\sigma_{\\mathrm{HH}}^*\\) combines with carbon \\(2p_x\\) to form a bonding orbital \\(\\sigma_x\\) and a corresponding antibonding partner above it. Meanwhile \\(2p_y\\), with no symmetry match at all, stays behind as an essentially pure carbon p orbital. In the lowest state of methylene, \\(\\sigma_s\\), \\(\\sigma_z\\), and \\(\\sigma_x\\) are occupied, while the unused \\(2p_y\\) orbital is left empty. That empty nonbonding p orbital is a major part of what makes methylene chemically eager to react: it is lower than the true antibonding orbitals, yet it is still vacant.",
          "visuals": [
            {
              "id": "fig-1.16",
              "label": "Figure 1.16",
              "kind": "figure",
              "caption": "The antibonding H₂ fragment couples with carbon 2pₓ, while carbon 2pᵧ has no symmetry partner and remains nonbonding."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.06-p005",
          "text": "The bent geometry follows from this pattern. If the molecule were forced into a linear arrangement, the overlap responsible for \\(\\sigma_x\\) would indeed improve because the hydrogen combination and carbon \\(2p_x\\) would approach in a more nearly head-on way. But the \\(\\sigma_z\\) orbital would then lose its bonding role altogether, because the hydrogens would lie in the nodal plane of the relevant p orbital. One gains in one channel and loses in another, and the loss is greater. The bent structure keeps both types of stabilization alive. Thus methylene is not bent because carbon has mysteriously decided to \"rehybridize\"; it is bent because the available symmetry-allowed combinations lower the electronic energy more effectively in that geometry.",
          "visuals": [
            {
              "id": "fig-1.16",
              "label": "Figure 1.16",
              "kind": "figure",
              "caption": "The bent structure wins because it preserves more than one bonding channel; forcing methylene linear would strengthen one interaction but destroy another."
            }
          ],
          "equations": [],
          "videos": []
        }
      ]
    },
    {
      "id": "01.07",
      "number": "01.07",
      "title": "Hybridisation as a Chosen Description",
      "paragraphs": [
        {
          "id": "01.07-p001",
          "text": "The delocalized molecular-orbital account is more honest, but it has one inconvenience: in methane or methylene there is no single occupied molecular orbital that can simply be pointed to and called one particular C—H bond. Hybridisation is a remedy for that inconvenience. It does not introduce new physics. It reorganizes the same carbon \\(2s\\) and \\(2p\\) functions into new linear combinations chosen for geometric usefulness before those combinations are allowed to overlap with neighboring atoms. The move is therefore representational. One trades a delocalized but direct picture for a more localized and more chemically intuitive one.",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.07-p002",
          "text": "The coefficients in a hybrid orbital are fixed by normalization and by geometry. For an \\(sp\\) pair one writes\n\\[\nh_{\\pm} = \\frac{1}{\\sqrt{2}}(2s \\pm 2p_x),\n\\]\nso that the squares of the coefficients add to 1 and the two hybrids point in opposite directions. For trigonal bonding one can form three \\(sp^2\\) hybrids; one convenient example is\n\\[\nh = \\sqrt{\\frac13}\\,2s + \\sqrt{\\frac12}\\,2p_x + \\sqrt{\\frac16}\\,2p_z,\n\\]\nwith two analogous companions rotated through \\(120^\\circ\\). For tetrahedral bonding the coefficients are adjusted again, for example\n\\[\nh = \\frac12\\,2s + \\frac{1}{\\sqrt2}\\,2p_x + \\frac12\\,2p_z,\n\\]\ntogether with three related combinations. In every case the point is the same: the hybrid is not discovered inside the atom as a pre-existing object. It is constructed as a normalized linear combination suited to a chosen bonding pattern.",
          "visuals": [
            {
              "id": "fig-1.18",
              "label": "Figure 1.18",
              "kind": "figure",
              "caption": "sp, sp², and sp³ hybrids are constructed as normalized linear combinations chosen to point in geometrically useful directions."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.07-p003",
          "text": "Figure 1.18 lays out these combinations, but Figure 1.19 is just as important because it corrects the usual cartoon. The conventional hybrid is drawn as a thin large lobe with a tiny back lobe. The actual wavefunction is subtler. Because the carbon 2s orbital already contains an inner radial structure, the nucleus sits inside the back region of the hybrid, and a little of the forward lobe wraps behind the nucleus. The hybrid is therefore fatter and less one-sided than classroom sketches suggest. The sketch is useful, but only under a mental reservation: it encodes direction and sign more than literal shape.",
          "visuals": [
            {
              "id": "fig-1.19",
              "label": "Figure 1.19",
              "kind": "figure",
              "caption": "A contour section through an sp³ hybrid shows that the real wavefunction is fuller and subtler than the thin classroom cartoon."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.07-p004",
          "text": "Once an \\(sp^3\\) hybrid has been chosen, its interaction with hydrogen 1s is handled exactly as in the hydrogen molecule. A bonding \\(\\sigma_{\\mathrm{CH}}\\) combination and an antibonding \\(\\sigma_{\\mathrm{CH}}^*\\) combination result, as shown in Figure 1.20. Four equivalent \\(sp^3\\) hybrids directed toward the corners of a tetrahedron then give the familiar methane picture of four equal C—H bonds in Figure 1.21. This localized language is often wonderfully convenient. It makes the equality of the four bonds immediately visible, and it aligns the orbital picture with the ordinary structural formula in a way the fully delocalized methane orbitals do not.",
          "visuals": [
            {
              "id": "fig-1.20",
              "label": "Figure 1.20",
              "kind": "figure",
              "caption": "A hydrogen 1s orbital and a carbon sp³ hybrid generate a bonding C–H sigma orbital and a higher antibonding partner."
            },
            {
              "id": "fig-1.21",
              "label": "Figure 1.21",
              "kind": "figure",
              "caption": "Four equivalent sp³ hybrids pointing toward a tetrahedron produce the familiar localized picture of the methane bonds."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.07-p005",
          "text": "Yet the convenience comes with a price. The hybrid picture hides distinctions among the occupied methane orbitals that the full molecular-orbital treatment keeps in view. Ionization data, for example, know perfectly well that electrons are being removed from orbitals of different energies, and the delocalized picture explains that at once. The hybrid picture tends to blur such differences into four apparently identical bonds. It is therefore best used knowingly. One should also resist the common habit of saying that an atom itself \"is \\(sp^3\\)\" or that a molecule \"rehybridizes\" as though something inside nature had physically swapped labels. The geometry is real; the hybridisation scheme is our chosen way of organizing the wavefunctions that describe it.",
          "visuals": [],
          "equations": [],
          "videos": []
        }
      ]
    },
    {
      "id": "01.08",
      "number": "01.08",
      "title": "Ethane and the C—C Sigma Bond",
      "paragraphs": [
        {
          "id": "01.08-p001",
          "text": "Ethane introduces a new task: not merely C—H bonding, but a genuine C—C bond. The full set of valence orbitals is already large — fourteen valence electrons distributed over seven bonding molecular orbitals — so Figure 1.22 is intentionally selective. It shows the seven occupied bonding orbitals together with several antibonding ones, enough to reveal the structure without drowning it in bookkeeping. The essential point is that the C—C bond is not generated by one orbital alone. It is assembled from several molecular orbitals, though one of them contributes far more strongly than the others.",
          "visuals": [
            {
              "id": "fig-1.22",
              "label": "Figure 1.22",
              "kind": "figure",
              "caption": "Ethane has seven occupied bonding orbitals, and the carbon–carbon bond emerges from several of them rather than from one isolated object."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.08-p002",
          "text": "The two orbitals labelled \\(\\sigma_s\\) and \\(\\sigma_s'\\) are built largely from the carbon 2s functions and resemble the hydrogen \\(\\sigma\\) and \\(\\sigma^*\\) pair in one respect: their decisive overlap lies directly on the line joining the nuclei, so they are sigma-type orbitals. The lower one is strongly bonding between the carbons; the higher one is correspondingly antibonding with respect to the C—C contact, though still helpful elsewhere in the molecule, especially for C—H bonding. More important still for the C—C bond is the orbital labelled \\(\\sigma_x\\), built mostly from the two carbon \\(2p_x\\) orbitals aimed head-on along the carbon-carbon axis. Figure 1.24 isolates this interaction. It is the clearest single orbital contribution to the C—C sigma bond.",
          "visuals": [
            {
              "id": "fig-1.24",
              "label": "Figure 1.24",
              "kind": "figure",
              "caption": "The strongest single contribution to the ethane C–C bond comes from head-on overlap of the carbon p orbitals aligned along the bond axis."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.08-p003",
          "text": "The sideways overlaps built from \\(2p_y\\) and \\(2p_z\\) are weaker. They produce orbitals of pi type even in ethane, though here they do not create a distinct double bond. Their density lies above and below, or to the sides of, the internuclear line instead of squarely on it. Figure 1.23 explains the consequence in overlap language. The sigma overlap integral for p orbitals approaching head-on is substantially larger at ordinary C—C bond lengths than the corresponding pi overlap integral for sideways approach. Sideways overlap still enhances electron density between the nuclei, but less efficiently and at a less favorable location for screening nuclear repulsion. Thus pi bonding is inherently weaker than sigma bonding when all else is comparable.",
          "visuals": [
            {
              "id": "fig-1.23",
              "label": "Figure 1.23",
              "kind": "figure",
              "caption": "At ordinary C–C distances the sigma overlap is much larger than the corresponding sideways pi overlap, which is why sigma bonding is stronger."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.08-p004",
          "text": "In ethane the bonding and antibonding contributions from the \\(p_y\\) and \\(p_z\\) sectors largely cancel as far as the C—C bond itself is concerned, even though those orbitals remain useful for the C—H framework. The net C—C bond is therefore governed above all by the on-axis sigma interactions, especially \\(\\sigma_x\\), together with the fact that \\(\\sigma_s\\) is somewhat more bonding than \\(\\sigma_s'\\) is antibonding. One may certainly switch to the hybrid picture and say that the bond comes from overlap of two \\(sp^3\\) hybrids on carbon. That is a perfectly serviceable summary. But it is only a summary. The fuller molecular-orbital description shows where that localized image comes from and why it works.",
          "visuals": [],
          "equations": [],
          "videos": []
        }
      ]
    },
    {
      "id": "01.09",
      "number": "01.09",
      "title": "Ethylene and the Pi Bond",
      "paragraphs": [
        {
          "id": "01.09-p001",
          "text": "Ethylene is the point at which the sigma framework and the pi bond separate cleanly enough to be treated almost as independent worlds. The \\(1s\\) orbitals of the four hydrogens, together with the carbon \\(2s\\), \\(2p_x\\), and \\(2p_y\\) orbitals, generate five low-lying bonding orbitals that make up the sigma framework shown in Figure 1.25. Ten valence electrons fill those orbitals. Outside that framework, standing higher in energy yet still occupied, is one more bonding orbital built almost entirely from the two carbon \\(2p_z\\) orbitals overlapping sideways. That is the \\(\\pi\\) bond of ethylene.",
          "visuals": [
            {
              "id": "fig-1.25",
              "label": "Figure 1.25",
              "kind": "figure",
              "caption": "Ethylene separates cleanly into a low-lying sigma framework and a higher, self-contained pi bond built from the carbon 2p_z orbitals."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.09-p002",
          "text": "The interaction diagram for that bond, Figure 1.26, is the exact analogue of the hydrogen \\(\\sigma/\\sigma^*\\) diagram, but with p orbitals instead of s orbitals. Because the orbital is localized on two equivalent atoms, the coefficients are again the familiar two-center values. In the bonding combination the coefficients have the same sign and equal magnitude, \\(c_1 = c_2 = 0.707\\); in the antibonding combination they retain equal magnitude but opposite sign, \\(c_1 = 0.707\\), \\(c_2 = -0.707\\). The bonding orbital has enhanced density between the carbons above and below the molecular plane. The antibonding orbital has a node between the atoms. Two electrons occupy the lower \\(\\pi\\) orbital, none the upper \\(\\pi^*\\), and that extra stabilizing interaction is why ethylene is stronger and shorter at the carbon-carbon contact than ethane.",
          "visuals": [
            {
              "id": "fig-1.26",
              "label": "Figure 1.26",
              "kind": "figure",
              "caption": "The ethylene pi bond is the two-center p-orbital analogue of the hydrogen sigma bond: one bonding combination and one antibonding combination."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.09-p003",
          "text": "Yet the pi bond is not the whole double bond. The carbon-carbon sigma bonding inside the framework remains stronger than the pi bonding added on top of it. The reason is geometric and shows up in the overlap integrals. Sideways p-p overlap is less effective than head-on sigma overlap, even when the orbitals are otherwise comparable. In the simple Hückel language used here, the p orbital energy on carbon is taken as a reference value \\(\\alpha\\), and the stabilization of the bonding pi orbital is measured by \\(\\beta\\). For ethylene the drop \\(E_\\pi\\) is about \\(\\beta \\approx 140\\ \\mathrm{kJ\\,mol^{-1}}\\), so the two electrons in the bonding pi orbital contribute about \\(280\\ \\mathrm{kJ\\,mol^{-1}}\\) of total pi stabilization. That is substantial, but it sits on top of an even more important sigma skeleton.",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.09-p004",
          "text": "This clean separation of the sigma framework from the pi system is the heart of Hückel theory. Since the hydrogens all lie in the nodal plane of the \\(2p_z\\) orbitals, they do not mix into the pi bond at all in this approximation. One may therefore treat the two p orbitals as a self-contained two-level system. Figure 1.27 translates that picture into the \"electron in a box\" analogy. If one imagines a box extending slightly beyond the two carbons, the bonding \\(\\pi\\) orbital resembles the lowest sine wave in the box: no interior node, same sign at both atoms. The antibonding \\(\\pi^*\\) orbital resembles the next sine wave: one interior node, opposite signs at the two atoms. The vertical coefficient lines drawn over the atoms simply restate the same phase pattern in algebraic language.",
          "visuals": [
            {
              "id": "fig-1.27",
              "label": "Figure 1.27",
              "kind": "figure",
              "caption": "The electron-in-a-box sine waves reproduce the nodal pattern and coefficient signs of the bonding and antibonding pi orbitals in ethylene."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "01.09-p005",
          "text": "The later contour and wire-mesh figures complete the picture. Figure 1.28 shows that even sideways overlap can build extra electron density between the nuclei, though not on the internuclear axis itself. Figure 1.29 gives the three-dimensional character more vividly: \\(\\pi\\) is a single continuous envelope above and below the bond, whereas \\(\\pi^*\\) splits into separate lobes because the phase reversal inserts a node between the carbons. This is why the word \"double bond\" is useful but incomplete. Ethylene does not consist of one sigma stick plus one pi stick laid beside it. It is a sigma framework plus a higher, weaker, but still decisive delocalized pi interaction.",
          "visuals": [
            {
              "id": "fig-1.28",
              "label": "Figure 1.28",
              "kind": "figure",
              "caption": "Contour sections show that sideways p overlap still builds density between the carbons, though not directly along the internuclear axis."
            },
            {
              "id": "fig-1.29",
              "label": "Figure 1.29",
              "kind": "figure",
              "caption": "Wire-mesh surfaces make the three-dimensional difference between the continuous pi envelope and the nodal split of pi-star easy to see."
            }
          ],
          "equations": [],
          "videos": []
        }
      ]
    }
  ],
  "stats": {
    "sectionCount": 9,
    "paragraphCount": 58,
    "visualCount": 44,
    "equationCount": 8
  }
};
