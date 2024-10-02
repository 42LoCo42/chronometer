{
  outputs = { flake-utils, nixpkgs, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs { inherit system; }; in rec {
        packages.default = pkgs.stdenv.mkDerivation {
          pname = "chronometer";
          version = "1";
          src = ./.;

          nativeBuildInputs = with pkgs; [
            nodePackages.typescript
          ];

          buildPhase = ''
            tsc --build
          '';

          installPhase = ''
            cp -r www $out
          '';
        };

        devShells.default = pkgs.mkShell {
          inputsFrom = [ packages.default ];
          packages = with pkgs; [
            python3 # http.server
          ];
        };
      });
}
