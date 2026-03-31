const BOOK_DATA = {
  "title": "2 — Concepts of Bonding and Orbital Interaction",
  "language": "en",
  "sections": [
    {
      "id": "02.01",
      "number": "02.01",
      "title": "Orbital Interaction Energy",
      "paragraphs": [
        {
          "id": "02.01-p001",
          "text": "To see what orbital interaction energy really means, begin with the simplest nontrivial case: two atomic orbitals, \\(\\chi_1\\) on atom \\(A\\) and \\(\\chi_2\\) on atom \\(B\\), placed close enough to interact. Diagram 2.1 shows nothing more elaborate than this arrangement, but it already contains the whole logic of molecular-orbital formation. The new molecular orbitals are sought not as isolated atomic states, but as linear combinations of the original basis functions. Thus the interacting system is described by two molecular orbitals, \\(\\psi_1\\) and \\(\\psi_2\\), written as\n\\[\n\\psi_1 = c_{11}\\chi_1 + c_{21}\\chi_2, \\qquad\n\\psi_2 = c_{12}\\chi_1 + c_{22}\\chi_2\n\\tag{2.1}\n\\]\nThe coefficients \\(c_{mi}\\) tell how much of each atomic orbital appears in each molecular orbital. The first subscript labels the atomic orbital, and the second labels the molecular orbital.",
          "visuals": [
            {
              "id": "diag-2.1",
              "label": "",
              "kind": "diagram",
              "caption": "Two atomic orbitals, χ₁ on atom A and χ₂ on atom B, are placed opposite one another as the simplest possible two-center interaction problem."
            }
          ],
          "equations": [
            {
              "id": "eq-2.1",
              "label": "2.1",
              "latex": "\\psi_1 = c_{11}\\chi_1 + c_{21}\\chi_2, \\qquad \\psi_2 = c_{12}\\chi_1 + c_{22}\\chi_2",
              "spoken": "",
              "note": "The molecular orbitals are written as linear combinations of the two starting atomic orbitals."
            }
          ],
          "videos": []
        },
        {
          "id": "02.01-p002",
          "text": "Before solving for those coefficients, one needs the overlap and Hamiltonian matrix elements. The normalization conditions are \\(\\langle \\chi_1 \\mid \\chi_1 \\rangle = \\langle \\chi_2 \\mid \\chi_2 \\rangle = 1\\), while the mutual overlap is \\(\\langle \\chi_1 \\mid \\chi_2 \\rangle = S_{12}\\). In the same basis, the effective one-electron Hamiltonian contributes the diagonal energies \\(H_{11} = e_1^0\\) and \\(H_{22} = e_2^0\\), together with the interaction element \\(H_{12}\\):\n\\[\n\\langle \\chi_1 \\mid \\chi_1 \\rangle = \\langle \\chi_2 \\mid \\chi_2 \\rangle = 1, \\qquad\n\\langle \\chi_1 \\mid \\chi_2 \\rangle = S_{12}\n\\tag{2.2}\n\\]\n\\[\n\\langle \\chi_1 \\mid H^{\\mathrm{eff}} \\mid \\chi_1 \\rangle = H_{11} = e_1^0, \\qquad\n\\langle \\chi_2 \\mid H^{\\mathrm{eff}} \\mid \\chi_2 \\rangle = H_{22} = e_2^0, \\qquad\n\\langle \\chi_1 \\mid H^{\\mathrm{eff}} \\mid \\chi_2 \\rangle = H_{12}\n\\tag{2.3}\n\\]\nBecause the overlap matrix is symmetric, \\(S_{12} = S_{21}\\), and therefore the Hamiltonian matrix is symmetric as well. If the phases of \\(\\chi_1\\) and \\(\\chi_2\\) are chosen so that \\(S_{12} > 0\\), the interaction element is negative:\n\\[\nH_{12} \\propto -S_{12} < 0\n\\tag{2.4}\n\\]\nThat sign will control the stabilizing or destabilizing character of the resulting combinations.",
          "visuals": [],
          "equations": [
            {
              "id": "eq-2.2",
              "label": "2.2",
              "latex": "\\langle \\chi_1 \\mid \\chi_1 \\rangle = \\langle \\chi_2 \\mid \\chi_2 \\rangle = 1, \\qquad \\langle \\chi_1 \\mid \\chi_2 \\rangle = S_{12}",
              "spoken": "",
              "note": "These relations define normalization of the individual basis orbitals and their mutual overlap."
            },
            {
              "id": "eq-2.3",
              "label": "2.3",
              "latex": "\\langle \\chi_1 \\mid H^{\\mathrm{eff}} \\mid \\chi_1 \\rangle = H_{11} = e_1^0, \\qquad \\langle \\chi_2 \\mid H^{\\mathrm{eff}} \\mid \\chi_2 \\rangle = H_{22} = e_2^0, \\qquad \\langle \\chi_1 \\mid H^{\\mathrm{eff}} \\mid \\chi_2 \\rangle = H_{12}",
              "spoken": "",
              "note": "The diagonal Hamiltonian elements give the starting orbital energies, while H12 measures the coupling between the two orbitals."
            },
            {
              "id": "eq-2.4",
              "label": "2.4",
              "latex": "H_{12} \\propto -S_{12} < 0",
              "spoken": "",
              "note": "With phases chosen so that the overlap is positive, the interaction matrix element is negative."
            }
          ],
          "videos": []
        },
        {
          "id": "02.01-p003",
          "text": "The allowed molecular-orbital energies are found by requiring a nontrivial solution of the secular equations. In the present two-orbital basis, the determinant is\n\\[\n\\begin{vmatrix}\ne_1^0 - e_i & H_{12} - e_i S_{12} \\\\\nH_{12} - e_i S_{12} & e_2^0 - e_i\n\\end{vmatrix} = 0\n\\tag{2.5}\n\\]\nExpanding the determinant gives\n\\[\n(e_1^0 - e_i)(e_2^0 - e_i) - (H_{12} - e_i S_{12})^2 = 0\n\\tag{2.6}\n\\]\nEverything now depends on whether the two starting orbitals are degenerate, \\(e_1^0 = e_2^0\\), or nondegenerate, \\(e_1^0 \\neq e_2^0\\).",
          "visuals": [],
          "equations": [
            {
              "id": "eq-2.5",
              "label": "2.5",
              "latex": "\\begin{vmatrix} e_1^0 - e_i & H_{12} - e_i S_{12} \\\\ H_{12} - e_i S_{12} & e_2^0 - e_i \\end{vmatrix} = 0",
              "spoken": "",
              "note": "The secular determinant gives the allowed molecular-orbital energies in the two-orbital basis."
            },
            {
              "id": "eq-2.6",
              "label": "2.6",
              "latex": "(e_1^0 - e_i)(e_2^0 - e_i) - (H_{12} - e_i S_{12})^2 = 0",
              "spoken": "",
              "note": "Expanding the determinant produces the quadratic relation that will be studied in the degenerate and nondegenerate cases."
            }
          ],
          "videos": []
        },
        {
          "id": "02.01-p004",
          "text": "Degenerate interaction",
          "visuals": [],
          "equations": [
            {
              "id": "eq-2.7",
              "label": "2.7",
              "latex": "e_1 = \\frac{e_1^0 + H_{12}}{1 + S_{12}}, \\qquad e_2 = \\frac{e_1^0 - H_{12}}{1 - S_{12}}",
              "spoken": "",
              "note": "For degenerate starting orbitals, the interaction splits the common energy into one lower and one higher level."
            }
          ],
          "videos": []
        },
        {
          "id": "02.01-p005",
          "text": "If the two starting orbitals have the same energy, the quadratic collapses to a particularly transparent form. Setting \\(e_1^0 = e_2^0\\) in (2.6) gives two molecular-orbital energies:\n\\[\ne_1 = \\frac{e_1^0 + H_{12}}{1 + S_{12}}, \\qquad\ne_2 = \\frac{e_1^0 - H_{12}}{1 - S_{12}}\n\\tag{2.7}\n\\]\nThe lower solution \\(e_1\\) corresponds to the in-phase combination, and the higher solution \\(e_2\\) to the out-of-phase combination. The denominators matter: the orbitals are not being combined in an orthogonal basis, so the overlap enters the energy formula directly.",
          "visuals": [
            {
              "id": "table-2.1",
              "label": "",
              "kind": "table",
              "caption": "The table collects the small-x expansions used repeatedly in the analysis: reciprocal series such as 1/(1±x) and square-root approximations for weak interactions."
            }
          ],
          "equations": [
            {
              "id": "eq-2.8",
              "label": "2.8",
              "latex": "e_1 = \\frac{e_1^0 + H_{12}}{1 + S_{12}} \\approx (e_1^0 + H_{12})(1 - S_{12} + S_{12}^2) \\approx e_1^0 + (H_{12} - e_1^0 S_{12}) - S_{12}(H_{12} - e_1^0 S_{12})",
              "spoken": "",
              "note": "The lower energy is expanded for small overlap so that the leading interaction term and the overlap correction can be separated."
            },
            {
              "id": "eq-2.9",
              "label": "2.9",
              "latex": "e_2 = \\frac{e_1^0 - H_{12}}{1 - S_{12}} \\approx (e_1^0 - H_{12})(1 + S_{12} + S_{12}^2) \\approx e_1^0 - (H_{12} - e_1^0 S_{12}) - S_{12}(H_{12} - e_1^0 S_{12})",
              "spoken": "",
              "note": "The upper energy receives the opposite leading shift, but the same upward overlap correction."
            }
          ],
          "videos": []
        },
        {
          "id": "02.01-p006",
          "text": "When the interaction is weak, so that \\(S_{12}\\) is small, the denominators may be expanded with the elementary series collected in Table 2.1. Using \\(1/(1+x) \\approx 1-x+x^2\\) and \\(1/(1-x) \\approx 1+x+x^2\\), one finds\n\\[\ne_1 = \\frac{e_1^0 + H_{12}}{1 + S_{12}}\n\\approx (e_1^0 + H_{12})(1 - S_{12} + S_{12}^2)\n\\approx e_1^0 + (H_{12} - e_1^0 S_{12}) - S_{12}(H_{12} - e_1^0 S_{12})\n\\tag{2.8}\n\\]\nand\n\\[\ne_2 = \\frac{e_1^0 - H_{12}}{1 - S_{12}}\n\\approx (e_1^0 - H_{12})(1 + S_{12} + S_{12}^2)\n\\approx e_1^0 - (H_{12} - e_1^0 S_{12}) - S_{12}(H_{12} - e_1^0 S_{12})\n\\tag{2.9}\n\\]\nThe point of these expansions is not merely algebraic convenience. They separate the leading interaction term, \\(\\pm (H_{12} - e_1^0 S_{12})\\), from the additional correction caused by nonzero overlap.",
          "visuals": [
            {
              "id": "diag-2.2",
              "label": "",
              "kind": "diagram",
              "caption": "The diagram compares the common starting energy with the split molecular-orbital energies and marks the overlap-induced asymmetry: the antibonding level rises more than the bonding level falls."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "02.01-p007",
          "text": "For a realistic atomic orbital, \\(e_1^0\\) is negative, and in ordinary cases \\(H_{12} - e_1^0 S_{12}\\) is negative as well. The first correction in (2.8) therefore lowers \\(e_1\\), while the corresponding term in (2.9) raises \\(e_2\\). Diagram 2.2 makes the geometry of this splitting visible: one combination is stabilized and the other destabilized. But the overlap term produces a further asymmetry. Because the same negative quantity is multiplied by \\(-S_{12}\\) in both expressions, both levels are pushed upward by the third term. The antibonding level therefore rises more than the bonding level falls. If one were to impose the artificial simplification \\(S_{12} = 0\\), the formulas would reduce to \\(e_i = e_1^0 \\pm H_{12}\\), and that asymmetry would disappear. The unequal splitting is therefore a direct consequence of the nonorthogonality of the interacting atomic orbitals.",
          "visuals": [
            {
              "id": "diag-2.3",
              "label": "",
              "kind": "diagram",
              "caption": "Two electrons both occupy the lower molecular orbital, so the interaction energy reflects the stabilization of the bonding combination alone."
            },
            {
              "id": "diag-2.4",
              "label": "",
              "kind": "diagram",
              "caption": "Four electrons occupy both resulting levels; the antibonding occupation overwhelms the bonding gain and makes the net interaction unfavorable."
            }
          ],
          "equations": [
            {
              "id": "eq-2.10",
              "label": "2.10",
              "latex": "\\Delta E^{(2)} = 2e_1 - 2e_1^0 \\approx 2(H_{12} - e_1^0 S_{12})(1 - S_{12})",
              "spoken": "",
              "note": "The two-electron interaction energy is obtained by comparing the filled lower molecular orbital with the two original one-electron levels."
            },
            {
              "id": "eq-2.11",
              "label": "2.11",
              "latex": "\\Delta E^{(4)} = 2(e_1 + e_2) - 4e_1^0 \\approx -4S_{12}(H_{12} - e_1^0 S_{12})",
              "spoken": "",
              "note": "When both resulting orbitals are doubly occupied, the upper-level penalty makes the total interaction destabilizing."
            }
          ],
          "videos": []
        },
        {
          "id": "02.01-p008",
          "text": "Once electrons are placed in the new molecular orbitals, the orbital interaction energy is obtained by comparing the filled molecular-orbital energies with the original atomic-orbital energies. Diagram 2.3 shows the two-orbital two-electron case, in which both electrons occupy the lower orbital \\(e_1\\). Diagram 2.4 shows the two-orbital four-electron case, in which both \\(e_1\\) and \\(e_2\\) are doubly occupied. Weighting the orbital energies by their electron counts gives\n\\[\n\\Delta E^{(2)} = 2e_1 - 2e_1^0 \\approx 2(H_{12} - e_1^0 S_{12})(1 - S_{12})\n\\tag{2.10}\n\\]\nand\n\\[\n\\Delta E^{(4)} = 2(e_1 + e_2) - 4e_1^0 \\approx -4S_{12}(H_{12} - e_1^0 S_{12})\n\\tag{2.11}\n\\]\nSince \\(S_{12} > 0\\) and \\(H_{12} - e_1^0 S_{12} < 0\\), the two-electron case is stabilizing, \\(\\Delta E^{(2)} < 0\\), whereas the four-electron case is destabilizing, \\(\\Delta E^{(4)} > 0\\). The reason is simple: with two electrons, only the lowered level is occupied; with four electrons, the occupation of the raised level more than cancels the gain from the lowered one.",
          "visuals": [
            {
              "id": "diag-2.5",
              "label": "",
              "kind": "diagram",
              "caption": "A high-spin arrangement with one electron in each molecular orbital. It represents the competition between exchange stabilization and the energetic cost of populating the upper level."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "02.01-p009",
          "text": "There is another way to distribute two electrons among the two molecular orbitals. Diagram 2.5 shows the high-spin arrangement, in which one electron occupies each molecular orbital with parallel spin. Its total interaction energy is half of \\(\\Delta E^{(4)}\\), because relative to the starting atomic picture one electron benefits from the lower level and one pays the cost of the upper level. The low-spin arrangement of Diagram 2.3 is preferred when the interaction is strong enough to split the two molecular orbitals substantially. When the two levels are degenerate or nearly degenerate, the high-spin state can become more favorable. In molecular language, this is the same balance expressed more generally by Hund's rule.",
          "visuals": [],
          "equations": [
            {
              "id": "eq-2.12",
              "label": "2.12",
              "latex": "(1 - S_{12}^2)e_i^2 + (2H_{12}S_{12} - e_1^0 - e_2^0)e_i + (e_1^0 e_2^0 - H_{12}^2) = 0",
              "spoken": "",
              "note": "For nondegenerate orbitals, the secular equation becomes a full quadratic whose coefficients depend on overlap, coupling, and the starting energy separation."
            },
            {
              "id": "eq-2.13",
              "label": "2.13",
              "latex": "e_1 = \\frac{-b - \\sqrt{D}}{2a}, \\qquad e_2 = \\frac{-b + \\sqrt{D}}{2a}",
              "spoken": "",
              "note": "The two molecular-orbital energies are the two roots of the quadratic equation."
            },
            {
              "id": "eq-2.14",
              "label": "2.14",
              "latex": "a = 1 - S_{12}^2, \\qquad b = 2H_{12}S_{12} - e_1^0 - e_2^0, \\qquad D = b^2 - 4ac",
              "spoken": "",
              "note": "These definitions collect the quadratic coefficients and its discriminant."
            }
          ],
          "videos": []
        },
        {
          "id": "02.01-p010",
          "text": "Nondegenerate interaction",
          "visuals": [],
          "equations": [
            {
              "id": "eq-2.15",
              "label": "2.15",
              "latex": "D = (2H_{12}S_{12} - e_1^0 - e_2^0)^2 - 4(1 - S_{12}^2)(e_1^0 e_2^0 - H_{12}^2) = (e_1^0 - e_2^0)^2 + 4(H_{12} - e_1^0 S_{12})(H_{12} - e_2^0 S_{12})",
              "spoken": "",
              "note": "The discriminant separates naturally into the original energy gap and a correction produced by the interaction between the two orbitals."
            },
            {
              "id": "eq-2.16",
              "label": "2.16",
              "latex": "\\sqrt{D} = -(e_1^0 - e_2^0)\\left[1 + \\frac{4(H_{12} - e_1^0 S_{12})(H_{12} - e_2^0 S_{12})}{(e_1^0 - e_2^0)^2}\\right]^{1/2} \\approx -(e_1^0 - e_2^0)\\left[1 + \\frac{2(H_{12} - e_1^0 S_{12})(H_{12} - e_2^0 S_{12})}{(e_1^0 - e_2^0)^2}\\right]",
              "spoken": "",
              "note": "For weak interaction, the square root of the discriminant is expanded about the zeroth-order energy separation."
            }
          ],
          "videos": []
        },
        {
          "id": "02.01-p011",
          "text": "The algebra changes when the two starting orbitals do not begin at the same energy. Suppose \\(e_1^0 < e_2^0\\), so that orbital \\(\\chi_1\\) lies lower than \\(\\chi_2\\). Rearranging (2.6) now produces a quadratic in \\(e_i\\):\n\\[\n(1 - S_{12}^2)e_i^2 + (2H_{12}S_{12} - e_1^0 - e_2^0)e_i + (e_1^0 e_2^0 - H_{12}^2) = 0\n\\tag{2.12}\n\\]\nIts two solutions are written in the standard quadratic form,\n\\[\ne_1 = \\frac{-b - \\sqrt{D}}{2a}, \\qquad\ne_2 = \\frac{-b + \\sqrt{D}}{2a}\n\\tag{2.13}\n\\]\nwith\n\\[\na = 1 - S_{12}^2, \\qquad\nb = 2H_{12}S_{12} - e_1^0 - e_2^0, \\qquad\nD = b^2 - 4ac\n\\tag{2.14}\n\\]\nand \\(c = e_1^0 e_2^0 - H_{12}^2\\). The structure is standard, but the chemistry is not hidden inside the quadratic formula: the orbital energy difference \\(e_2^0 - e_1^0\\), the overlap \\(S_{12}\\), and the coupling \\(H_{12}\\) all enter explicitly.",
          "visuals": [],
          "equations": [
            {
              "id": "eq-2.17",
              "label": "2.17",
              "latex": "2(1 - S_{12}^2)e_1 = e_1^0 + e_2^0 - 2H_{12}S_{12} + (e_1^0 - e_2^0)\\left[1 + \\frac{2(H_{12} - e_1^0 S_{12})(H_{12} - e_2^0 S_{12})}{(e_1^0 - e_2^0)^2}\\right] = 2\\left[e_1^0(1 - S_{12}^2) + \\frac{(H_{12} - e_1^0 S_{12})^2}{e_1^0 - e_2^0}\\right]",
              "spoken": "",
              "note": "After substitution and simplification, the lower molecular-orbital energy is isolated in a form that shows its second-order correction explicitly."
            },
            {
              "id": "eq-2.18",
              "label": "2.18",
              "latex": "e_1 \\approx e_1^0 + \\frac{(H_{12} - e_1^0 S_{12})^2}{e_1^0 - e_2^0}",
              "spoken": "",
              "note": "The lower orbital is stabilized by a second-order correction inversely proportional to the separation from the upper starting orbital."
            }
          ],
          "videos": []
        },
        {
          "id": "02.01-p012",
          "text": "To see the physical content more clearly, expand the discriminant. A short calculation gives\n\\[\n\\begin{aligned}\nD &= (2H_{12}S_{12} - e_1^0 - e_2^0)^2 - 4(1 - S_{12}^2)(e_1^0 e_2^0 - H_{12}^2) \\\\\n  &= (e_1^0 - e_2^0)^2 + 4(H_{12} - e_1^0 S_{12})(H_{12} - e_2^0 S_{12})\n\\end{aligned}\n\\tag{2.15}\n\\]\nNow assume again that the interaction is small compared with the zeroth-order energy separation. Then the square root may be expanded as\n\\[\n\\begin{aligned}\n\\sqrt{D}\n&= -(e_1^0 - e_2^0)\n\\left[\n1 + \\frac{4(H_{12} - e_1^0 S_{12})(H_{12} - e_2^0 S_{12})}{(e_1^0 - e_2^0)^2}\n\\right]^{1/2} \\\\\n&\\approx -(e_1^0 - e_2^0)\n\\left[\n1 + \\frac{2(H_{12} - e_1^0 S_{12})(H_{12} - e_2^0 S_{12})}{(e_1^0 - e_2^0)^2}\n\\right]\n\\end{aligned}\n\\tag{2.16}\n\\]\nThe minus sign in front is deliberate. Since \\(e_1^0 - e_2^0 < 0\\), it ensures that \\(\\sqrt{D}\\) itself remains positive.",
          "visuals": [
            {
              "id": "diag-2.6",
              "label": "",
              "kind": "diagram",
              "caption": "The lower starting orbital is pushed downward and the upper one upward. The diagram also shows that the upward displacement of the higher level is larger in magnitude."
            }
          ],
          "equations": [
            {
              "id": "eq-2.19",
              "label": "2.19",
              "latex": "e_2 \\approx e_2^0 + \\frac{(H_{12} - e_2^0 S_{12})^2}{e_2^0 - e_1^0}",
              "spoken": "",
              "note": "The upper orbital acquires the corresponding positive second-order correction."
            }
          ],
          "videos": []
        },
        {
          "id": "02.01-p013",
          "text": "Substituting the expanded square root into the quadratic solution and simplifying yields the lower molecular-orbital energy. Written in a way that displays the cancellation clearly,\n\\[\n\\begin{aligned}\n2(1 - S_{12}^2)e_1\n&= e_1^0 + e_2^0 - 2H_{12}S_{12}\n+ (e_1^0 - e_2^0)\n\\left[\n1 + \\frac{2(H_{12} - e_1^0 S_{12})(H_{12} - e_2^0 S_{12})}{(e_1^0 - e_2^0)^2}\n\\right] \\\\\n&= 2\\left[\ne_1^0(1 - S_{12}^2)\n+ \\frac{(H_{12} - e_1^0 S_{12})^2}{e_1^0 - e_2^0}\n\\right]\n\\end{aligned}\n\\tag{2.17}\n\\]\nand therefore\n\\[\ne_1 \\approx e_1^0 + \\frac{(H_{12} - e_1^0 S_{12})^2}{e_1^0 - e_2^0}\n\\tag{2.18}\n\\]\nBecause \\(e_1^0 - e_2^0 < 0\\), the correction is negative, so the lower orbital is driven still lower by the interaction.",
          "visuals": [
            {
              "id": "diag-2.7",
              "label": "",
              "kind": "diagram",
              "caption": "In the nondegenerate two-electron case, both electrons occupy the lowered molecular orbital derived mainly from the lower starting state."
            },
            {
              "id": "diag-2.8",
              "label": "",
              "kind": "diagram",
              "caption": "In the nondegenerate four-electron case, occupation of both resulting levels makes the net interaction unfavorable."
            }
          ],
          "equations": [
            {
              "id": "eq-2.20",
              "label": "2.20",
              "latex": "\\Delta E^{(2)} = 2e_1 - 2e_1^0 \\approx 2\\,\\frac{(H_{12} - e_1^0 S_{12})^2}{e_1^0 - e_2^0}",
              "spoken": "",
              "note": "For two electrons, the interaction remains stabilizing because only the lowered molecular orbital is occupied."
            },
            {
              "id": "eq-2.21",
              "label": "2.21",
              "latex": "\\Delta E^{(4)} = 2(e_1 + e_2) - 2(e_1^0 + e_2^0) \\approx -4S_{12}\\left(H_{12} - \\frac{e_1^0 + e_2^0}{2}S_{12}\\right)",
              "spoken": "",
              "note": "For four electrons, the occupation of the raised level produces a net destabilization."
            }
          ],
          "videos": []
        },
        {
          "id": "02.01-p014",
          "text": "The same reasoning gives the upper molecular-orbital energy:\n\\[\ne_2 \\approx e_2^0 + \\frac{(H_{12} - e_2^0 S_{12})^2}{e_2^0 - e_1^0}\n\\tag{2.19}\n\\]\nHere the denominator is positive, so the correction raises the upper level. Diagram 2.6 displays exactly this pattern: the lower starting orbital is stabilized, the upper starting orbital is destabilized. The splitting is again asymmetric. Since \\(0 > e_2^0 > e_1^0\\), one has \\((H_{12} - e_1^0 S_{12})^2 < (H_{12} - e_2^0 S_{12})^2\\), so the upper orbital is pushed away more strongly than the lower one is pulled downward.",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "02.01-p015",
          "text": "The filling arguments now proceed just as in the degenerate case. Diagram 2.7 represents the nondegenerate two-electron case, where the two electrons occupy the lower molecular orbital, and Diagram 2.8 the nondegenerate four-electron case, where both resulting levels are fully occupied. The corresponding interaction energies are\n\\[\n\\Delta E^{(2)} = 2e_1 - 2e_1^0\n\\approx 2\\,\\frac{(H_{12} - e_1^0 S_{12})^2}{e_1^0 - e_2^0}\n\\tag{2.20}\n\\]\nand\n\\[\n\\Delta E^{(4)} = 2(e_1 + e_2) - 2(e_1^0 + e_2^0)\n\\approx -4S_{12}\\left(H_{12} - \\frac{e_1^0 + e_2^0}{2}S_{12}\\right)\n\\tag{2.21}\n\\]\nSince \\(e_1^0 - e_2^0 < 0\\), the quantity \\(\\Delta E^{(2)}\\) is negative, so the two-electron interaction is stabilizing. And because \\(H_{12} - e_1^0 S_{12}\\) and \\(H_{12} - e_2^0 S_{12}\\) are both negative when \\(S_{12} > 0\\), the four-electron interaction is again destabilizing. The central lesson survives every version of the algebra: interaction helps when electrons can exploit the lowered combination without being forced to occupy the raised one, and it hurts when population of the antibonding partner becomes unavoidable.",
          "visuals": [],
          "equations": [],
          "videos": []
        }
      ]
    },
    {
      "id": "02.02",
      "number": "02.02",
      "title": "Molecular Orbital Coefficients",
      "paragraphs": [
        {
          "id": "02.02-p001",
          "text": "Once the energies have been found, the next question is what the molecular orbitals actually look like. Their shapes are fixed by the coefficients \\(c_{1i}\\) and \\(c_{2i}\\) in the linear combinations. These coefficients are determined by the secular equations together with normalization:\n\\[\n(e_1^0 - e_i)c_{1i} + (H_{12} - e_i S_{12})c_{2i} = 0\n\\]\n\\[\n(H_{12} - e_i S_{12})c_{1i} + (e_2^0 - e_i)c_{2i} = 0\n\\tag{2.22}\n\\]\n\\[\n\\langle \\psi_i \\mid \\psi_i \\rangle = c_{1i}^2 + 2c_{1i}c_{2i}S_{12} + c_{2i}^2 = 1\n\\tag{2.23}\n\\]\nThe first pair of equations states that the coefficients must make the trial combination an eigenfunction of the effective Hamiltonian. The normalization condition then fixes the overall scale. What emerges is not only an energy splitting, but also a precise statement of how much of each atomic orbital enters each molecular orbital.",
          "visuals": [],
          "equations": [
            {
              "id": "eq-2.22",
              "label": "2.22",
              "latex": "(e_1^0 - e_i)c_{1i} + (H_{12} - e_i S_{12})c_{2i} = 0, \\qquad (H_{12} - e_i S_{12})c_{1i} + (e_2^0 - e_i)c_{2i} = 0",
              "spoken": "",
              "note": "The secular equations determine the relative weights of the two basis orbitals in each molecular orbital."
            },
            {
              "id": "eq-2.23",
              "label": "2.23",
              "latex": "\\langle \\psi_i \\mid \\psi_i \\rangle = c_{1i}^2 + 2c_{1i}c_{2i}S_{12} + c_{2i}^2 = 1",
              "spoken": "",
              "note": "Normalization fixes the overall scale of the coefficient vector once the ratio of the coefficients is known."
            }
          ],
          "videos": []
        },
        {
          "id": "02.02-p002",
          "text": "Degenerate interaction",
          "visuals": [],
          "equations": [
            {
              "id": "eq-2.24",
              "label": "2.24",
              "latex": "\\frac{c_{21}}{c_{11}} = -\\frac{e_1^0 - e_1}{H_{12} - e_1S_{12}} = 1",
              "spoken": "",
              "note": "In the degenerate case, the lower molecular orbital contains equal contributions from the two starting orbitals."
            },
            {
              "id": "eq-2.25",
              "label": "2.25",
              "latex": "c_{11} = c_{21} = \\pm \\frac{1}{\\sqrt{2 + 2S_{12}}}",
              "spoken": "",
              "note": "Normalization gives the common magnitude of the two coefficients in the lower orbital."
            },
            {
              "id": "eq-2.26",
              "label": "2.26",
              "latex": "\\psi_1 = \\pm \\frac{1}{\\sqrt{2 + 2S_{12}}}(\\chi_1 + \\chi_2)",
              "spoken": "",
              "note": "The lower molecular orbital is the in-phase combination of the two degenerate atomic orbitals."
            }
          ],
          "videos": []
        },
        {
          "id": "02.02-p003",
          "text": "When the starting orbitals are degenerate, \\(e_1^0 = e_2^0\\), the coefficient ratio for the lower molecular orbital is especially simple:\n\\[\n\\frac{c_{21}}{c_{11}} = -\\frac{e_1^0 - e_1}{H_{12} - e_1S_{12}} = 1\n\\tag{2.24}\n\\]\nSo the two atomic orbitals contribute equally to the lower molecular orbital. Normalization then gives\n\\[\nc_{11} = c_{21} = \\pm \\frac{1}{\\sqrt{2 + 2S_{12}}}\n\\tag{2.25}\n\\]\nand therefore\n\\[\n\\psi_1 = \\pm \\frac{1}{\\sqrt{2 + 2S_{12}}}(\\chi_1 + \\chi_2)\n\\tag{2.26}\n\\]\nFor the upper molecular orbital the same procedure gives\n\\[\n\\frac{c_{12}}{c_{22}} = -\\frac{e_1^0 - e_2}{H_{12} - e_2S_{12}} = -1\n\\tag{2.27}\n\\]\nand so\n\\[\n\\psi_2 = \\pm \\frac{1}{\\sqrt{2 - 2S_{12}}}(\\chi_1 - \\chi_2)\n\\tag{2.28}\n\\]\nFigure 2.1 makes the qualitative content of these formulas immediate. The lower orbital is the in-phase combination, while the upper orbital is the out-of-phase combination. The overall sign is irrelevant: if \\(\\psi_i\\) is an eigenfunction, then \\(-\\psi_i\\) is the same physical state. What matters is the relative sign of the two coefficients. In the lower orbital the lobes reinforce each other between the nuclei; in the upper orbital they oppose each other, producing a node. Figure 2.2 shows this directly for H₂: solid contours mark positive values of the wavefunction, dotted contours negative ones, and the dashed line in \\(\\sigma^\\ast\\) marks the nodal plane that cuts across the H–H internuclear axis.",
          "visuals": [
            {
              "id": "fig-2.1",
              "label": "",
              "kind": "figure",
              "caption": "An orbital-interaction diagram for two degenerate atomic s orbitals. The lower MO is the in-phase combination and the upper MO the out-of-phase combination."
            },
            {
              "id": "fig-2.2",
              "label": "",
              "kind": "figure",
              "caption": "Contour plots of the H₂ σ and σ* molecular orbitals. Solid contours represent positive wavefunction values, dotted contours negative ones, and the dashed line marks the antibonding nodal plane."
            }
          ],
          "equations": [
            {
              "id": "eq-2.27",
              "label": "2.27",
              "latex": "\\frac{c_{12}}{c_{22}} = -\\frac{e_1^0 - e_2}{H_{12} - e_2S_{12}} = -1",
              "spoken": "",
              "note": "For the upper molecular orbital, the two coefficients have equal magnitude and opposite sign."
            },
            {
              "id": "eq-2.28",
              "label": "2.28",
              "latex": "\\psi_2 = \\pm \\frac{1}{\\sqrt{2 - 2S_{12}}}(\\chi_1 - \\chi_2)",
              "spoken": "",
              "note": "The upper molecular orbital is the out-of-phase combination of the two degenerate atomic orbitals."
            }
          ],
          "videos": []
        },
        {
          "id": "02.02-p004",
          "text": "Equal weight does not mean equal coefficient magnitude in the two molecular orbitals. In the bonding combination, \\(|c_{11}| = |c_{21}|\\), and in the antibonding combination, \\(|c_{12}| = |c_{22}|\\), but the two normalizations differ because \\(1 > S_{12} > 0\\). The denominator \\(\\sqrt{2 - 2S_{12}}\\) is smaller than \\(\\sqrt{2 + 2S_{12}}\\), so the coefficients in the higher orbital are larger in magnitude than those in the lower one. The contour plots of Figure 2.2 reflect exactly this fact: the antibonding orbital has more strongly weighted lobes.",
          "visuals": [
            {
              "id": "fig-2.2",
              "label": "",
              "kind": "figure",
              "caption": "The contour plots also reveal that the antibonding orbital carries larger coefficient magnitudes than the bonding orbital, even though each MO still contains equal weight from the two atoms."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "02.02-p005",
          "text": "Nondegenerate interaction",
          "visuals": [],
          "equations": [
            {
              "id": "eq-2.29",
              "label": "2.29",
              "latex": "\\frac{c_{21}}{c_{11}} = -\\frac{e_1^0 - e_1}{H_{12} - e_1S_{12}} = \\frac{t}{1 - tS_{12}}",
              "spoken": "",
              "note": "In the nondegenerate case, the coefficient ratio is expressed through the mixing parameter t."
            }
          ],
          "videos": []
        },
        {
          "id": "02.02-p006",
          "text": "When the starting orbitals are not degenerate, the lower molecular orbital no longer contains equal amounts of \\(\\chi_1\\) and \\(\\chi_2\\). Assume again that \\(e_1^0 < e_2^0\\), so that \\(\\chi_1\\) starts lower in energy. Combining the energy formula (2.18) with the secular equations gives\n\\[\n\\frac{c_{21}}{c_{11}} = -\\frac{e_1^0 - e_1}{H_{12} - e_1S_{12}} = \\frac{t}{1 - tS_{12}}\n\\tag{2.29}\n\\]\nwhere\n\\[\nt = \\frac{H_{12} - e_1^0S_{12}}{e_1^0 - e_2^0}\n\\]\nThe quantity \\(t\\) measures how much the upper atomic orbital \\(\\chi_2\\) is mixed into the lower one. If the interaction is weak, then both \\(t\\) and \\(S_{12}\\) are small, and the ratio can be expanded:\n\\[\n\\frac{c_{21}}{c_{11}} = \\frac{t}{1 - tS_{12}} = t(1 + tS_{12} + \\cdots) \\approx t\n\\tag{2.30}\n\\]\nSo to first order, the amount of \\(\\chi_2\\) mixed into the lower molecular orbital is just \\(t\\) itself.",
          "visuals": [],
          "equations": [
            {
              "id": "eq-2.30",
              "label": "2.30",
              "latex": "\\frac{c_{21}}{c_{11}} = \\frac{t}{1 - tS_{12}} = t(1 + tS_{12} + \\cdots) \\approx t",
              "spoken": "",
              "note": "For weak interaction, the coefficient ratio reduces to the mixing parameter t itself to leading order."
            },
            {
              "id": "eq-2.31",
              "label": "2.31",
              "latex": "\\left(\\frac{1}{c_{11}}\\right)^2 = 1 + 2\\left(\\frac{c_{21}}{c_{11}}\\right)S_{12} + \\left(\\frac{c_{21}}{c_{11}}\\right)^2 = 1 + 2tS_{12} + t^2",
              "spoken": "",
              "note": "Normalization converts the coefficient ratio into an explicit expression for the leading coefficient."
            },
            {
              "id": "eq-2.32",
              "label": "2.32",
              "latex": "c_{11} = \\frac{1}{\\sqrt{1 + 2tS_{12} + t^2}} \\approx 1 - tS_{12} - \\frac{1}{2}t^2",
              "spoken": "",
              "note": "The leading coefficient is expanded to second order in the weak-interaction regime."
            },
            {
              "id": "eq-2.33",
              "label": "2.33",
              "latex": "c_{21} = tc_{11} = t\\left(1 - tS_{12} - \\frac{1}{2}t^2\\right) \\approx t",
              "spoken": "",
              "note": "The smaller coefficient inherits the same leading-order mixing strength."
            },
            {
              "id": "eq-2.34",
              "label": "2.34",
              "latex": "\\psi_1 \\approx \\left(1 - tS_{12} - \\frac{1}{2}t^2\\right)\\chi_1 + t\\chi_2",
              "spoken": "",
              "note": "The lower molecular orbital remains mostly the lower atomic orbital with a small admixture of the higher one."
            }
          ],
          "videos": []
        },
        {
          "id": "02.02-p007",
          "text": "Normalization now determines the size of the leading coefficient. Substituting the ratio into (2.23) gives\n\\[\n\\left(\\frac{1}{c_{11}}\\right)^2\n= 1 + 2\\left(\\frac{c_{21}}{c_{11}}\\right)S_{12}\n+ \\left(\\frac{c_{21}}{c_{11}}\\right)^2\n= 1 + 2tS_{12} + t^2\n\\tag{2.31}\n\\]\nUsing the same small-parameter expansions as before,\n\\[\nc_{11} = \\frac{1}{\\sqrt{1 + 2tS_{12} + t^2}}\n\\approx 1 - tS_{12} - \\frac{1}{2}t^2\n\\tag{2.32}\n\\]\nand therefore\n\\[\nc_{21} = tc_{11}\n= t\\left(1 - tS_{12} - \\frac{1}{2}t^2\\right)\n\\approx t\n\\tag{2.33}\n\\]\nThe lower molecular orbital thus takes the form\n\\[\n\\psi_1 \\approx \\left(1 - tS_{12} - \\frac{1}{2}t^2\\right)\\chi_1 + t\\chi_2\n\\tag{2.34}\n\\]\nThis formula says exactly what intuition suggests: the lower molecular orbital is still mainly \\(\\chi_1\\), but it acquires a small admixture of the higher orbital \\(\\chi_2\\).",
          "visuals": [],
          "equations": [
            {
              "id": "eq-2.35",
              "label": "2.35",
              "latex": "\\psi_2 \\approx t'\\chi_1 + \\left(1 - t'S_{12} - \\frac{1}{2}t'^2\\right)\\chi_2",
              "spoken": "",
              "note": "The upper molecular orbital is the complementary mixture, dominated by the higher atomic orbital."
            }
          ],
          "videos": []
        },
        {
          "id": "02.02-p008",
          "text": "The upper molecular orbital is obtained in the same way:\n\\[\n\\psi_2 \\approx t'\\chi_1 + \\left(1 - t'S_{12} - \\frac{1}{2}t'^2\\right)\\chi_2\n\\tag{2.35}\n\\]\nwhere\n\\[\nt' = \\frac{H_{12} - e_2^0S_{12}}{e_2^0 - e_1^0}\n\\]\nThe parameters \\(t\\) and \\(t'\\) are therefore the mixing coefficients in the strict sense. They do not merely say that two orbitals interact; they measure how strongly one basis function leaks into the other as a consequence of that interaction.",
          "visuals": [
            {
              "id": "fig-2.3",
              "label": "",
              "kind": "figure",
              "caption": "An orbital-interaction diagram for two nondegenerate atomic s orbitals. The lobe sizes encode unequal coefficients and show the in-phase and out-of-phase mixing patterns of the two resulting MOs."
            }
          ],
          "equations": [
            {
              "id": "eq-2.36",
              "label": "2.36",
              "latex": "t = \\frac{H_{12} - e_1^0S_{12}}{e_1^0 - e_2^0} = \\frac{(-)}{(-)} > 0",
              "spoken": "",
              "note": "The sign of t shows that the higher atomic orbital mixes in-phase into the lower molecular orbital."
            },
            {
              "id": "eq-2.37",
              "label": "2.37",
              "latex": "t' = \\frac{H_{12} - e_2^0S_{12}}{e_2^0 - e_1^0} = \\frac{(-)}{(+)} < 0",
              "spoken": "",
              "note": "The sign of t' shows that the lower atomic orbital mixes out-of-phase into the upper molecular orbital."
            }
          ],
          "videos": []
        },
        {
          "id": "02.02-p009",
          "text": "Their signs matter. Since \\(H_{12} - e_i^0S_{12} < 0\\) in the normal cases under discussion, one has\n\\[\nt = \\frac{H_{12} - e_1^0S_{12}}{e_1^0 - e_2^0}\n= \\frac{(-)}{(-)} > 0\n\\tag{2.36}\n\\]\nand\n\\[\nt' = \\frac{H_{12} - e_2^0S_{12}}{e_2^0 - e_1^0}\n= \\frac{(-)}{(+)} < 0\n\\tag{2.37}\n\\]\nSo the higher-energy atomic orbital \\(\\chi_2\\) mixes in-phase into the lower molecular orbital \\(\\psi_1\\), whereas the lower atomic orbital \\(\\chi_1\\) mixes out-of-phase into the upper molecular orbital \\(\\psi_2\\). Figure 2.3 displays this clearly. The lower molecular orbital remains predominantly \\(\\chi_1\\) in character, and the upper one predominantly \\(\\chi_2\\). But as the zeroth-order energies \\(e_1^0\\) and \\(e_2^0\\) come closer together, the denominators in \\(t\\) and \\(t'\\) shrink, the mixing becomes stronger, and the molecular orbitals become less purely atomic in character. In the degenerate limit, the two orbitals contribute equally, as already seen above.",
          "visuals": [
            {
              "id": "table-2.2",
              "label": "",
              "kind": "table",
              "caption": "A compact summary of how interaction energies scale in the degenerate and nondegenerate cases. It highlights the contrast between linear overlap effects and second-order, gap-dependent behavior."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "02.02-p010",
          "text": "One further graphical convention is useful. In Figure 2.3, the relative sizes of the orbital lobes represent the relative magnitudes of the coefficients. That is why the smaller component in each molecular orbital is drawn with a smaller lobe. The same figure also reflects the inequality \\(|t'| > t\\): the coefficients in the higher molecular orbital are larger in magnitude than those in the lower one. Once again the antibonding combination carries the stronger coefficient weighting.",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "02.02-p011",
          "text": "Table 2.2 gathers the main interaction-energy trends established so far. For degenerate orbitals with two electrons, the stabilization is linear in the overlap, \\(\\Delta E^{(2)} \\propto -S_{12}\\). For the degenerate four-electron case, the net effect is quadratic, \\(\\Delta E^{(4)} \\propto S_{12}^2\\). In the nondegenerate two-electron case, the stabilization is still quadratic in the coupling but is weakened by the energy gap, scaling as \\(-S_{12}^2/|e_1^0 - e_2^0|\\). And for the nondegenerate four-electron case the net interaction remains quadratic, \\(\\Delta E^{(4)} \\propto S_{12}^2\\). The broad lesson is now doubly clear: interaction strength depends not only on overlap, but also on energy proximity, and the resulting molecular orbitals reveal that fact directly in their coefficients.",
          "visuals": [],
          "equations": [],
          "videos": []
        }
      ]
    },
    {
      "id": "02.03",
      "number": "02.03",
      "title": "The Two-Orbital Problem Summarized",
      "paragraphs": [
        {
          "id": "02.03-p001",
          "text": "The algebra is now complete enough that its chemical content can be stated plainly. Four facts dominate everything that follows. First, whether the interaction is degenerate or nondegenerate, the upper molecular orbital is driven upward more strongly than the lower one is driven downward. Second, stronger overlap means a larger total interaction energy in magnitude. Third, when the interacting orbitals begin at different energies, the interaction weakens as that energy gap grows. Fourth, the electron count decides whether the interaction helps or hurts: a two-orbital two-electron arrangement is stabilizing, whereas a two-orbital four-electron arrangement is destabilizing. That last point is the simple orbital reason why species such as He₂ or Ne₂ do not form ordinary bound molecules. The three-electron case lies between these extremes: for small overlap there is still a net stabilization, but if the overlap becomes too large the repulsive contribution from the upper level can win. In the degenerate case the crossover occurs at \\(S_{12} = 1/3\\).",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "02.03-p002",
          "text": "The shapes of the resulting molecular orbitals obey equally general rules. The lower orbital is always the in-phase combination, and the upper orbital the out-of-phase one, whether the starting levels are equal or unequal. The lower level therefore has no node of the relevant kind between the nuclei, while the upper level has one. The antibonding orbital also carries larger coefficients than its bonding partner. In the nondegenerate case there is an additional principle: each molecular orbital most strongly resembles the atomic orbital that lies closest to it in energy. Figure 2.3 showed this graphically by making the dominant lobe larger and the admixed lobe smaller.",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "02.03-p003",
          "text": "These conclusions are not confined to literal atomic orbitals. The same two-level logic will return later when one or both starting functions are fragment orbitals rather than atomic ones. For practical diagram building, two questions must always be answered. How large is the interaction? And where do the unperturbed levels sit relative to one another? The first question is governed by the coupling. Since the energy shifts are proportional to \\(H_{12}^2\\), and \\(H_{12}\\) is itself tied to overlap, larger overlap means stronger splitting. The same shifts are also inversely proportional to the zeroth-order energy separation \\(e_2^0 - e_1^0\\). Strong overlap with a small gap gives a large effect; weak overlap with a large gap gives a small one.",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "02.03-p004",
          "text": "To place the starting atomic orbitals on an energy scale, Diagram 2.9 gives state-averaged ionization potentials for the main-group valence orbitals. The pattern across a row is the easiest to read. Moving from left to right, both the \\(s\\) and \\(p\\) orbitals drop in energy because the added valence electrons do not fully screen the added nuclear charge. The electrons therefore feel a steadily stronger attraction to the nucleus. The effect is stronger for \\(s\\) orbitals than for \\(p\\) orbitals, because \\(s\\) electrons penetrate closer to the nucleus. As a result, the \\(s\\)-\\(p\\) energy gap generally widens from left to right across a period.",
          "visuals": [
            {
              "id": "diag-2.9",
              "label": "",
              "kind": "diagram",
              "caption": "A periodic-table array of valence-orbital ionization potentials for the main-group atoms. It serves as a qualitative guide for placing starting orbital energies in interaction diagrams."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "02.03-p005",
          "text": "Down a column the situation is less monotonic. The valence orbitals usually become more diffuse, their most probable radii increase, and their energies rise accordingly. That trend is clear in going from the second row to the third. But two corrections matter. The filled \\(3d\\) shell does not screen the \\(4s\\) and \\(4p\\) orbitals very well, and it affects the \\(4s\\) level especially strongly. That is why the \\(4s\\) orbitals of Ga, Ge, and As lie lower than one might naively expect from simple extrapolation. A second correction appears in the sixth row, where relativistic contraction of inner \\(s\\) and \\(p\\) shells pulls the valence region inward as well, again affecting the \\(6s\\) levels more strongly than the \\(6p\\) levels. The orbital energies in Diagram 2.9 should therefore be used as qualitative guides rather than rigid numerical inputs. In a molecular environment they are shifted further by charge redistribution, often represented schematically by\n\\[\ne^0 = Aq^2 + Bq + C\n\\]\nwhere \\(q\\) is the atomic charge in the molecule, \\(A\\) and \\(B\\) depend on the atom type, and \\(C\\) is the reference orbital energy read from the diagram.",
          "visuals": [],
          "equations": [],
          "videos": []
        },
        {
          "id": "02.03-p006",
          "text": "A still more useful qualitative guide is electronegativity. In the Allen scheme used here, it is defined as an average over the valence \\(s\\) and \\(p\\) orbital energies:\n\\[\n\\chi_{\\mathrm{spec}} = K \\, \\frac{m e_p^0 + n e_s^0}{m+n}\n\\]\nwhere \\(e_p^0\\) and \\(e_s^0\\) are the valence \\(p\\)- and \\(s\\)-orbital energies, \\(m\\) and \\(n\\) count the corresponding valence electrons, and \\(K\\) is a scale factor. Figure 2.4 condenses the periodic trends into a single graph. Electronegativity rises from left to right across a row, falls sharply from the second to the third row within a column, and then changes more gently lower down the table. For qualitative orbital diagrams, this often gives a more dependable first placement than raw ionization-potential tables alone.",
          "visuals": [
            {
              "id": "fig-2.4",
              "label": "",
              "kind": "figure",
              "caption": "Electronegativity plotted against row for the main-group atoms. The graph compresses the periodic trends into a single visual guide for relative orbital energies."
            }
          ],
          "equations": [],
          "videos": []
        }
      ]
    },
    {
      "id": "02.04",
      "number": "02.04",
      "title": "Electron Density Distribution",
      "paragraphs": [
        {
          "id": "02.04-p001",
          "text": "The energy formulas become more intelligible once they are translated into a statement about where the electrons actually move. The simplest way to do that is to evaluate the expectation value of the effective Hamiltonian with the approximate molecular orbitals. For the lower nondegenerate molecular orbital, inserting the expression for \\(\\psi_1\\) from Section 2.2 gives\n\\[\ne_1 = \\langle \\psi_1 \\mid H^{\\mathrm{eff}} \\mid \\psi_1 \\rangle\n\\approx (1 - 2tS_{12} - t^2)e_1^0 + 2tH_{12} + t^2 e_2^0\n\\tag{2.38}\n\\]\nafter dropping terms beyond second order in \\(t\\) and \\(S_{12}\\). The first term is the energy of remaining mostly on atom \\(A\\), the middle term is the gain from constructive interaction between the two orbitals, and the final term is the energetic price of admixing some of the higher orbital. The balance of those contributions reproduces the earlier stabilization formula.",
          "visuals": [],
          "equations": [
            {
              "id": "eq-2.38",
              "label": "2.38",
              "latex": "e_1 = \\langle \\psi_1 \\mid H^{\\mathrm{eff}} \\mid \\psi_1 \\rangle \\approx (1 - 2tS_{12} - t^2)e_1^0 + 2tH_{12} + t^2 e_2^0",
              "spoken": "",
              "note": "The lower nondegenerate orbital energy is resolved into a dominant atomic contribution, an interaction term, and the cost of admixing the higher orbital."
            }
          ],
          "videos": []
        },
        {
          "id": "02.04-p002",
          "text": "The same analysis for the upper molecular orbital yields\n\\[\ne_2 \\approx (1 - 2t'S_{12} - t'^2)e_2^0 + 2t'H_{12} + t'^2 e_1^0\n\\tag{2.39}\n\\]\nThe structure is identical, but now \\(t' < 0\\). That sign reversal changes the physical meaning of the cross term \\(2t'H_{12}\\): instead of constructive buildup between the nuclei, one gets destructive interference and a destabilizing contribution. The same algebra that described energy splitting is therefore already hinting at a redistribution of electron density.",
          "visuals": [],
          "equations": [
            {
              "id": "eq-2.39",
              "label": "2.39",
              "latex": "e_2 \\approx (1 - 2t'S_{12} - t'^2)e_2^0 + 2t'H_{12} + t'^2 e_1^0",
              "spoken": "",
              "note": "The upper orbital has the same formal structure as the lower one, but the sign of the mixing coefficient makes the interaction destabilizing."
            }
          ],
          "videos": []
        },
        {
          "id": "02.04-p003",
          "text": "That redistribution appears explicitly when one examines the density associated with each molecular orbital. For the lower orbital,\n\\[\n\\psi_1^2 \\approx (1 - 2tS_{12} - t^2)\\langle \\chi_1 \\mid \\chi_1 \\rangle + 2t\\langle \\chi_1 \\mid \\chi_2 \\rangle + t^2\\langle \\chi_2 \\mid \\chi_2 \\rangle\n\\tag{2.40}\n\\]\nand for the upper orbital,\n\\[\n\\psi_2^2 \\approx (1 - 2t'S_{12} - t'^2)\\langle \\chi_2 \\mid \\chi_2 \\rangle + 2t'\\langle \\chi_1 \\mid \\chi_2 \\rangle + t'^2\\langle \\chi_1 \\mid \\chi_1 \\rangle\n\\tag{2.41}\n\\]\nIntegrating over all space, and using the normalization of the atomic orbitals, gives the identities\n\\[\n1 = (1 - 2tS_{12} - t^2) + 2tS_{12} + t^2\n\\tag{2.42}\n\\]\nand\n\\[\n1 = (1 - 2t'S_{12} - t'^2) + 2t'S_{12} + t'^2\n\\tag{2.43}\n\\]\nThese are not empty bookkeeping exercises. They separate the total density into three pieces: density left on the original atom, density transferred onto the other atom, and density accumulated in the overlap region between them.",
          "visuals": [],
          "equations": [
            {
              "id": "eq-2.40",
              "label": "2.40",
              "latex": "\\psi_1^2 \\approx (1 - 2tS_{12} - t^2)\\langle \\chi_1 \\mid \\chi_1 \\rangle + 2t\\langle \\chi_1 \\mid \\chi_2 \\rangle + t^2\\langle \\chi_2 \\mid \\chi_2 \\rangle",
              "spoken": "",
              "note": "The density of the lower molecular orbital is decomposed into density remaining on the first atom, density in the overlap region, and density transferred to the second atom."
            },
            {
              "id": "eq-2.41",
              "label": "2.41",
              "latex": "\\psi_2^2 \\approx (1 - 2t'S_{12} - t'^2)\\langle \\chi_2 \\mid \\chi_2 \\rangle + 2t'\\langle \\chi_1 \\mid \\chi_2 \\rangle + t'^2\\langle \\chi_1 \\mid \\chi_1 \\rangle",
              "spoken": "",
              "note": "The corresponding density decomposition for the upper molecular orbital shows how the overlap term changes sign."
            },
            {
              "id": "eq-2.42",
              "label": "2.42",
              "latex": "1 = (1 - 2tS_{12} - t^2) + 2tS_{12} + t^2",
              "spoken": "",
              "note": "Integration over all space confirms normalization for the lower molecular orbital."
            },
            {
              "id": "eq-2.43",
              "label": "2.43",
              "latex": "1 = (1 - 2t'S_{12} - t'^2) + 2t'S_{12} + t'^2",
              "spoken": "",
              "note": "The same normalization identity holds for the upper molecular orbital."
            }
          ],
          "videos": []
        },
        {
          "id": "02.04-p004",
          "text": "For \\(\\psi_1\\), the coefficient \\(t\\) is positive, so the term \\(2tS_{12}\\) represents a positive buildup of density in the region between the nuclei. Diagram 2.10 sketches this transfer toward the bonding region, and Figure 2.5(a) shows the same effect as a density curve along the internuclear axis. The lower molecular orbital has more density between the nuclei than the simple superposition of two isolated atomic densities. That extra density pulls the two nuclei together and lowers the energy, which is why \\(\\psi_1\\) is called bonding. For \\(\\psi_2\\), by contrast, \\(t' < 0\\), so the overlap term removes density from the internuclear region. Diagram 2.11 and Figure 2.5(b) make that depletion visible. The density missing from between the nuclei weakens attraction and raises the energy, so \\(\\psi_2\\) is antibonding.",
          "visuals": [
            {
              "id": "diag-2.10",
              "label": "",
              "kind": "diagram",
              "caption": "A small schematic showing density being drawn from atom A into the region between A and B when the lower molecular orbital is formed."
            },
            {
              "id": "diag-2.11",
              "label": "",
              "kind": "diagram",
              "caption": "A complementary schematic showing density being removed from the internuclear region in the antibonding case."
            },
            {
              "id": "fig-2.5",
              "label": "",
              "kind": "figure",
              "caption": "Electron-density profiles along the internuclear axis. The bonding orbital builds density between the nuclei relative to a simple superposition of atomic densities, while the antibonding orbital depletes it."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "02.04-p005",
          "text": "The same idea extends to polyatomic systems. If a molecular orbital is expanded over many atomic orbitals as\n\\[\n\\psi_i = \\sum_{\\mu} c_{\\mu i}\\chi_{\\mu}\n\\tag{2.44}\n\\]\nthen one can define quantitative measures of where the electrons reside. The net population left in atomic orbital \\(\\chi_{\\mu}\\) is\n\\[\nP_{\\mu\\mu} = \\sum_i n_i c_{\\mu i}^2\n\\tag{2.45}\n\\]\nwhile the overlap population between orbitals \\(\\chi_{\\mu}\\) and \\(\\chi_{\\nu}\\) on atoms \\(A\\) and \\(B\\) is\n\\[\nP_{\\mu\\nu} = \\sum_i 2n_i c_{\\mu i}c_{\\nu i}S_{\\mu\\nu}\n\\tag{2.46}\n\\]\nA large positive \\(P_{\\mu\\nu}\\) means that orbital interaction has concentrated density in the region between the two atoms, which usually corresponds to stronger bonding and larger bond order.",
          "visuals": [],
          "equations": [
            {
              "id": "eq-2.44",
              "label": "2.44",
              "latex": "\\psi_i = \\sum_{\\mu} c_{\\mu i}\\chi_{\\mu}",
              "spoken": "",
              "note": "A polyatomic molecular orbital is expanded as a sum of atomic basis functions."
            },
            {
              "id": "eq-2.45",
              "label": "2.45",
              "latex": "P_{\\mu\\mu} = \\sum_i n_i c_{\\mu i}^2",
              "spoken": "",
              "note": "This is the net population retained in atomic orbital \\chi_\\mu after the molecular orbital mixing is formed."
            },
            {
              "id": "eq-2.46",
              "label": "2.46",
              "latex": "P_{\\mu\\nu} = \\sum_i 2n_i c_{\\mu i}c_{\\nu i}S_{\\mu\\nu}",
              "spoken": "",
              "note": "The overlap population measures electron density transferred into the region shared by two atomic orbitals."
            }
          ],
          "videos": []
        },
        {
          "id": "02.04-p006",
          "text": "To convert orbital populations into atomic populations, one defines the gross population of orbital \\(\\chi_{\\mu}\\) by\n\\[\nq_{\\mu} = P_{\\mu\\mu} + \\frac{1}{2}\\sum_{\\nu \\ne \\mu} P_{\\mu\\nu}\n\\tag{2.47}\n\\]\nThe shared density is split equally between the two atoms, and the resulting atomic gross populations can then be compared with nuclear charges to obtain net atomic charges. This is the Mulliken population analysis. It is useful because it turns the language of bonding into concrete density partitions, but it should not be treated as numerically absolute. The results depend on the chosen basis set, on the precise effective Hamiltonian, and on how electron correlation is handled. Its equal partition of shared density is also a convention rather than a uniquely compelled truth.",
          "visuals": [],
          "equations": [
            {
              "id": "eq-2.47",
              "label": "2.47",
              "latex": "q_{\\mu} = P_{\\mu\\mu} + \\frac{1}{2}\\sum_{\\nu \\ne \\mu} P_{\\mu\\nu}",
              "spoken": "",
              "note": "The gross population assigns half of the shared density to each of the two atoms involved, yielding the Mulliken population scheme."
            }
          ],
          "videos": []
        },
        {
          "id": "02.04-p007",
          "text": "For the degenerate two-electron situation of Diagram 2.3, the population formulas confirm the bonding picture quantitatively:\n\\[\nP_{11} = P_{22} = 2\\left(\\frac{1}{\\sqrt{2+2S_{12}}}\\right)^2 = \\frac{1}{1+S_{12}} < 1\n\\tag{2.48}\n\\]\nand\n\\[\nP_{12} = 4\\left(\\frac{1}{\\sqrt{2+2S_{12}}}\\right)^2 S_{12} = \\frac{2S_{12}}{1+S_{12}} > 0\n\\tag{2.49}\n\\]\nEach original orbital loses some of its density, and that missing density reappears between the atoms as a positive overlap population. That is the density-level statement of stabilization.",
          "visuals": [],
          "equations": [
            {
              "id": "eq-2.48",
              "label": "2.48",
              "latex": "P_{11} = P_{22} = 2\\left(\\frac{1}{\\sqrt{2+2S_{12}}}\\right)^2 = \\frac{1}{1+S_{12}} < 1",
              "spoken": "",
              "note": "In the degenerate two-electron case, each original orbital loses some density because part of it has moved into the bonding region."
            },
            {
              "id": "eq-2.49",
              "label": "2.49",
              "latex": "P_{12} = 4\\left(\\frac{1}{\\sqrt{2+2S_{12}}}\\right)^2 S_{12} = \\frac{2S_{12}}{1+S_{12}} > 0",
              "spoken": "",
              "note": "The positive overlap population is the density-level signature of a stabilizing bond."
            }
          ],
          "videos": []
        },
        {
          "id": "02.04-p008",
          "text": "For the degenerate four-electron case of Diagram 2.4, the conclusion reverses:\n\\[\nP_{11} = P_{22} = 2\\left(\\frac{1}{\\sqrt{2+2S_{12}}}\\right)^2 + 2\\left(\\frac{1}{\\sqrt{2-2S_{12}}}\\right)^2 = \\frac{2}{1-S_{12}^2} > 0\n\\tag{2.50}\n\\]\nand\n\\[\nP_{12} = 4\\left(\\frac{1}{\\sqrt{2+2S_{12}}}\\right)^2 S_{12} - 4\\left(\\frac{1}{\\sqrt{2-2S_{12}}}\\right)^2 S_{12} = -\\frac{4S_{12}^2}{1-S_{12}^2} < 0\n\\tag{2.51}\n\\]\nNow the overlap population is negative. Occupying the antibonding orbital removes more density from the bonding region than the bonding orbital had added. Figure 2.5 summarizes this visually: relative to the simple superposition of two atomic densities, the gain in the lower orbital is smaller than the loss in the upper one when both are occupied.",
          "visuals": [],
          "equations": [
            {
              "id": "eq-2.50",
              "label": "2.50",
              "latex": "P_{11} = P_{22} = 2\\left(\\frac{1}{\\sqrt{2+2S_{12}}}\\right)^2 + 2\\left(\\frac{1}{\\sqrt{2-2S_{12}}}\\right)^2 = \\frac{2}{1-S_{12}^2} > 0",
              "spoken": "",
              "note": "Filling both the bonding and antibonding orbitals redistributes density so that more remains on the atoms themselves."
            },
            {
              "id": "eq-2.51",
              "label": "2.51",
              "latex": "P_{12} = 4\\left(\\frac{1}{\\sqrt{2+2S_{12}}}\\right)^2 S_{12} - 4\\left(\\frac{1}{\\sqrt{2-2S_{12}}}\\right)^2 S_{12} = -\\frac{4S_{12}^2}{1-S_{12}^2} < 0",
              "spoken": "",
              "note": "The negative overlap population shows that the antibonding occupation has removed net density from the region between the atoms."
            }
          ],
          "videos": []
        },
        {
          "id": "02.04-p009",
          "text": "Table 2.3 gathers the analogous population results for both degenerate and nondegenerate cases. The broad pattern survives intact: the two-orbital two-electron case gives a positive bond overlap population, while the two-orbital four-electron case gives a negative one. In the nondegenerate two-electron arrangement there is also a genuine transfer of density from the initially occupied lower orbital to the initially empty upper one. Because of that shift, the interaction is often described as a charge-transfer interaction. Diagram 2.12 expresses this in its simplest form: a filled donor orbital interacts with an empty acceptor orbital.",
          "visuals": [
            {
              "id": "table-2.3",
              "label": "",
              "kind": "table",
              "caption": "A summary of orbital and overlap populations for the degenerate and nondegenerate two-electron and four-electron cases. It makes the sign change of the overlap population especially easy to compare."
            },
            {
              "id": "diag-2.12",
              "label": "",
              "kind": "diagram",
              "caption": "A donor-acceptor sketch in which a filled lower orbital interacts with an empty higher one, emphasizing the charge-transfer character of the two-electron nondegenerate case."
            }
          ],
          "equations": [],
          "videos": []
        },
        {
          "id": "02.04-p010",
          "text": "The same logic scales up to many-orbital systems. For a central orbital interacting with several others, as sketched in Diagram 2.13, the single second-order correction of the two-level problem is replaced by a sum over all relevant partners:\n\\[\ne_1 \\approx e_1^0 + \\sum_{j \\ne 1} \\frac{(H_{1j} - e_1^0S_{1j})^2}{e_1^0 - e_j^0}\n\\tag{2.52}\n\\]\nEach nearby orbital contributes its own coupling term, weighted by both overlap and energy separation. In writing this simplest form one neglects interactions among the ligand orbitals themselves, but the message is already clear: the many-orbital problem does not abandon the two-orbital logic. It multiplies it.",
          "visuals": [
            {
              "id": "diag-2.13",
              "label": "",
              "kind": "diagram",
              "caption": "A central atom surrounded by several ligands, used to suggest how the two-orbital correction generalizes to a sum over many interacting neighbors."
            }
          ],
          "equations": [
            {
              "id": "eq-2.52",
              "label": "2.52",
              "latex": "e_1 \\approx e_1^0 + \\sum_{j \\ne 1} \\frac{(H_{1j} - e_1^0S_{1j})^2}{e_1^0 - e_j^0}",
              "spoken": "",
              "note": "In the many-orbital extension, the second-order stabilization of the reference orbital is the sum of separate contributions from each interacting partner."
            }
          ],
          "videos": []
        }
      ]
    }
  ],
  "stats": {
    "sectionCount": 4,
    "paragraphCount": 42,
    "visualCount": 22,
    "equationCount": 52
  }
};
